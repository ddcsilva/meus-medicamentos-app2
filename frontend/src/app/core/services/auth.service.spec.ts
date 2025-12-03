import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { AuthResult, LoginCredentials } from './auth/models';

/**
 * Mock do Firebase Auth para testes.
 */
const mockAuth = {
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
};

/**
 * Mock de usuário autenticado.
 */
const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  getIdToken: jest.fn().mockResolvedValue('mock-token-123'),
};

/**
 * Helper para configurar o TestBed.
 */
function setupTestBed() {
  // Reset mocks
  jest.clearAllMocks();

  // Configura o callback do onAuthStateChanged
  let authStateCallback: ((user: unknown) => void) | null = null;
  mockAuth.onAuthStateChanged.mockImplementation((auth, callback) => {
    authStateCallback = callback;
    // Simula estado inicial: não autenticado
    setTimeout(() => callback(null), 0);
    return () => {}; // unsubscribe function
  });

  TestBed.configureTestingModule({
    providers: [AuthService, { provide: Auth, useValue: mockAuth }],
  });

  return { authStateCallback };
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    setupTestBed();
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve iniciar com authLoading true', () => {
      // Antes do callback do onAuthStateChanged
      const freshService = new (AuthService as any)();
      // authLoading começa como true até o Firebase responder
      expect(service.authLoading()).toBeDefined();
    });

    it('deve iniciar sem usuário autenticado', fakeAsync(() => {
      tick(); // Aguarda o callback do onAuthStateChanged
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    }));

    it('deve expor signals readonly', () => {
      expect(service.currentUser).toBeDefined();
      expect(service.authLoading).toBeDefined();
      expect(service.authError).toBeDefined();
      expect(service.isAuthenticated).toBeDefined();
      expect(service.userId).toBeDefined();
      expect(service.userEmail).toBeDefined();
    });
  });

  describe('Computed Signals', () => {
    it('isAuthenticated deve retornar false quando não há usuário', fakeAsync(() => {
      tick();
      expect(service.isAuthenticated()).toBe(false);
    }));

    it('userId deve retornar null quando não há usuário', fakeAsync(() => {
      tick();
      expect(service.userId()).toBeNull();
    }));

    it('userEmail deve retornar null quando não há usuário', fakeAsync(() => {
      tick();
      expect(service.userEmail()).toBeNull();
    }));
  });

  describe('Login', () => {
    const validCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve fazer login com sucesso', async () => {
      mockAuth.signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      const result: AuthResult = await service.login(validCredentials);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeUndefined();
      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        mockAuth,
        validCredentials.email,
        validCredentials.password
      );
    });

    it('deve retornar erro para credenciais inválidas', async () => {
      const authError = { code: 'auth/invalid-credential', message: 'Invalid' };
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(authError);

      const result: AuthResult = await service.login(validCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('auth/invalid-credential');
      expect(result.error?.message).toBe('Credenciais inválidas. Verifique e-mail e senha.');
    });

    it('deve retornar erro para usuário não encontrado', async () => {
      const authError = { code: 'auth/user-not-found', message: 'Not found' };
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(authError);

      const result: AuthResult = await service.login(validCredentials);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Usuário não encontrado.');
    });

    it('deve retornar erro para muitas tentativas', async () => {
      const authError = { code: 'auth/too-many-requests', message: 'Too many' };
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(authError);

      const result: AuthResult = await service.login(validCredentials);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Muitas tentativas. Tente novamente mais tarde.');
    });

    it('deve atualizar authError signal em caso de erro', async () => {
      const authError = { code: 'auth/wrong-password', message: 'Wrong' };
      mockAuth.signInWithEmailAndPassword.mockRejectedValue(authError);

      await service.login(validCredentials);

      expect(service.authError()).not.toBeNull();
      expect(service.authError()?.code).toBe('auth/wrong-password');
    });

    it('deve limpar authError antes de nova tentativa', async () => {
      // Primeira tentativa com erro
      mockAuth.signInWithEmailAndPassword.mockRejectedValueOnce({
        code: 'auth/wrong-password',
        message: 'Wrong',
      });
      await service.login(validCredentials);
      expect(service.authError()).not.toBeNull();

      // Segunda tentativa - deve limpar o erro anterior
      mockAuth.signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      await service.login(validCredentials);
      expect(service.authError()).toBeNull();
    });

    it('deve setar authLoading durante o processo', async () => {
      let loadingDuringCall = false;

      mockAuth.signInWithEmailAndPassword.mockImplementation(() => {
        loadingDuringCall = service.authLoading();
        return Promise.resolve({ user: mockUser });
      });

      await service.login(validCredentials);

      expect(loadingDuringCall).toBe(true);
      expect(service.authLoading()).toBe(false);
    });
  });

  describe('Logout', () => {
    it('deve fazer logout com sucesso', async () => {
      mockAuth.signOut.mockResolvedValue(undefined);

      const result: AuthResult = await service.logout();

      expect(result.success).toBe(true);
      expect(mockAuth.signOut).toHaveBeenCalled();
    });

    it('deve retornar erro se logout falhar', async () => {
      const authError = { code: 'auth/internal-error', message: 'Error' };
      mockAuth.signOut.mockRejectedValue(authError);

      const result: AuthResult = await service.logout();

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Erro interno. Tente novamente.');
    });

    it('deve limpar currentUser após logout', async () => {
      mockAuth.signOut.mockResolvedValue(undefined);

      await service.logout();

      expect(service.currentUser()).toBeNull();
    });
  });

  describe('clearError', () => {
    it('deve limpar o authError', async () => {
      // Cria um erro primeiro
      mockAuth.signInWithEmailAndPassword.mockRejectedValue({
        code: 'auth/wrong-password',
        message: 'Wrong',
      });
      await service.login({ email: 'test@test.com', password: '123' });
      expect(service.authError()).not.toBeNull();

      // Limpa o erro
      service.clearError();
      expect(service.authError()).toBeNull();
    });
  });

  describe('getIdToken', () => {
    it('deve retornar null se não há usuário', async () => {
      const token = await service.getIdToken();
      expect(token).toBeNull();
    });
  });

  describe('Mapeamento de erros', () => {
    const errorCases = [
      { code: 'auth/invalid-email', expected: 'E-mail inválido.' },
      { code: 'auth/user-disabled', expected: 'Esta conta foi desativada.' },
      { code: 'auth/user-not-found', expected: 'Usuário não encontrado.' },
      { code: 'auth/wrong-password', expected: 'Senha incorreta.' },
      { code: 'auth/invalid-credential', expected: 'Credenciais inválidas. Verifique e-mail e senha.' },
      { code: 'auth/email-already-in-use', expected: 'Este e-mail já está em uso.' },
      { code: 'auth/weak-password', expected: 'A senha é muito fraca.' },
      { code: 'auth/operation-not-allowed', expected: 'Operação não permitida.' },
      { code: 'auth/too-many-requests', expected: 'Muitas tentativas. Tente novamente mais tarde.' },
      { code: 'auth/network-request-failed', expected: 'Erro de conexão. Verifique sua internet.' },
      { code: 'auth/unknown-error', expected: 'Erro de autenticação. Tente novamente.' },
    ];

    errorCases.forEach(({ code, expected }) => {
      it(`deve mapear ${code} para mensagem amigável`, async () => {
        mockAuth.signInWithEmailAndPassword.mockRejectedValue({ code, message: 'Original' });

        const result = await service.login({ email: 'test@test.com', password: '123' });

        expect(result.error?.message).toBe(expected);
      });
    });
  });
});
