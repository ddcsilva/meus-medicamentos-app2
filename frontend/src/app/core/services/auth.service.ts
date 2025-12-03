import { computed, inject, Injectable, OnDestroy, signal } from "@angular/core";
import {
  Auth,
  AuthError,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "@angular/fire/auth";

/**
 * Interface para o resultado de operações de autenticação.
 */
export interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: AuthErrorInfo;
}

/**
 * Interface para informações de erro de autenticação.
 */
export interface AuthErrorInfo {
  code: string;
  message: string;
}

/**
 * Interface para dados de login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Serviço de autenticação que encapsula Firebase Auth.
 *
 * Expõe estado reativo via signals:
 * - `currentUser` - Usuário autenticado atual
 * - `isAuthenticated` - Se há usuário autenticado
 * - `authLoading` - Se está carregando estado de autenticação
 *
 * @example
 * constructor(private auth: AuthService) {
 *   // Verificar autenticação
 *   if (this.auth.isAuthenticated()) {
 *     console.log('Usuário:', this.auth.currentUser()?.email);
 *   }
 *
 *   // Login
 *   const result = await this.auth.login({ email, password });
 *   if (result.success) {
 *     console.log('Login realizado!');
 *   }
 * }
 */
@Injectable({
  providedIn: "root",
})
export class AuthService implements OnDestroy {
  private readonly _auth = inject(Auth);
  private _authStateSubscription: (() => void) | null = null;

  // Signals para estado reativo
  private readonly _currentUser = signal<User | null>(null);
  private readonly _authLoading = signal<boolean>(true);
  private readonly _authError = signal<AuthErrorInfo | null>(null);

  /**
   * Usuário autenticado atual (readonly signal).
   */
  readonly currentUser = this._currentUser.asReadonly();

  /**
   * Indica se está carregando o estado de autenticação (readonly signal).
   */
  readonly authLoading = this._authLoading.asReadonly();

  /**
   * Último erro de autenticação (readonly signal).
   */
  readonly authError = this._authError.asReadonly();

  /**
   * Indica se há um usuário autenticado (computed signal).
   */
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /**
   * UID do usuário atual (computed signal).
   */
  readonly userId = computed(() => this._currentUser()?.uid ?? null);

  /**
   * Email do usuário atual (computed signal).
   */
  readonly userEmail = computed(() => this._currentUser()?.email ?? null);

  constructor() {
    this._initAuthStateListener();
  }

  ngOnDestroy(): void {
    // Limpar listener do Firebase Auth
    if (this._authStateSubscription) {
      this._authStateSubscription();
    }
  }

  /**
   * Inicializa o listener de estado de autenticação.
   * Atualiza os signals quando o estado muda.
   */
  private _initAuthStateListener(): void {
    this._authStateSubscription = onAuthStateChanged(
      this._auth,
      (user) => {
        this._currentUser.set(user);
        this._authLoading.set(false);

        if (!user) {
          this._authError.set(null);
        }
      },
      (error) => {
        console.error("Auth state error:", error);
        this._authLoading.set(false);
        this._authError.set({
          code: "auth/state-error",
          message: "Erro ao verificar estado de autenticação",
        });
      }
    );
  }

  /**
   * Realiza login com e-mail e senha.
   *
   * @param credentials - Credenciais de login (email e password)
   * @returns Promise com resultado da operação
   *
   * @example
   * const result = await this.auth.login({ email: 'user@example.com', password: '123456' });
   * if (result.success) {
   *   console.log('Login realizado!', result.user);
   * } else {
   *   console.error('Erro:', result.error?.message);
   * }
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    this._authLoading.set(true);
    this._authError.set(null);

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        this._auth,
        credentials.email,
        credentials.password
      );

      this._authLoading.set(false);

      return {
        success: true,
        user: userCredential.user,
      };
    } catch (error) {
      const authError = error as AuthError;
      const errorInfo = this._mapAuthError(authError);

      this._authError.set(errorInfo);
      this._authLoading.set(false);

      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  /**
   * Realiza logout do usuário atual.
   *
   * @returns Promise com resultado da operação
   *
   * @example
   * const result = await this.auth.logout();
   * if (result.success) {
   *   console.log('Logout realizado!');
   * }
   */
  async logout(): Promise<AuthResult> {
    this._authLoading.set(true);

    try {
      await signOut(this._auth);

      this._currentUser.set(null);
      this._authError.set(null);
      this._authLoading.set(false);

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      const errorInfo = this._mapAuthError(authError);

      this._authError.set(errorInfo);
      this._authLoading.set(false);

      return {
        success: false,
        error: errorInfo,
      };
    }
  }

  /**
   * Limpa o erro de autenticação atual.
   */
  clearError(): void {
    this._authError.set(null);
  }

  /**
   * Obtém o token ID do usuário atual.
   *
   * @param forceRefresh - Se deve forçar a renovação do token
   * @returns Promise com o token ou null se não autenticado
   *
   * @example
   * const token = await this.auth.getIdToken();
   * if (token) {
   *   // Usar token para chamadas à API
   * }
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const user = this._currentUser();
    if (!user) {
      return null;
    }

    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  }

  /**
   * Mapeia erros do Firebase Auth para mensagens amigáveis.
   *
   * @param error - Erro do Firebase Auth
   * @returns Informações do erro com mensagem amigável
   */
  private _mapAuthError(error: AuthError): AuthErrorInfo {
    const errorMessages: Record<string, string> = {
      "auth/invalid-email": "E-mail inválido.",
      "auth/user-disabled": "Esta conta foi desativada.",
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-credential":
        "Credenciais inválidas. Verifique e-mail e senha.",
      "auth/email-already-in-use": "Este e-mail já está em uso.",
      "auth/weak-password": "A senha é muito fraca.",
      "auth/operation-not-allowed": "Operação não permitida.",
      "auth/too-many-requests":
        "Muitas tentativas. Tente novamente mais tarde.",
      "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
      "auth/popup-closed-by-user": "Janela fechada pelo usuário.",
      "auth/cancelled-popup-request": "Operação cancelada.",
      "auth/internal-error": "Erro interno. Tente novamente.",
    };

    const message =
      errorMessages[error.code] || "Erro de autenticação. Tente novamente.";

    return {
      code: error.code,
      message,
    };
  }
}
