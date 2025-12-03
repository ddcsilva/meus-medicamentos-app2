# 🔥 Serviços Core

Este diretório contém serviços globais da aplicação.

---

## AuthService

Serviço de autenticação que encapsula Firebase Auth com estado reativo via signals.

### Uso

```typescript
import { AuthService } from '@core/services/auth.service';

@Component({...})
export class MeuComponente {
  private auth = inject(AuthService);
  
  // Signals reativos (usar no template ou computed)
  isAuthenticated = this.auth.isAuthenticated;
  currentUser = this.auth.currentUser;
  authLoading = this.auth.authLoading;
  
  async login() {
    const result = await this.auth.login({
      email: 'user@example.com',
      password: '123456'
    });
    
    if (result.success) {
      console.log('Login realizado!', result.user);
    } else {
      console.error('Erro:', result.error?.message);
    }
  }
  
  async logout() {
    await this.auth.logout();
  }
}
```

### Signals Disponíveis

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `currentUser` | `Signal<User \| null>` | Usuário autenticado atual |
| `isAuthenticated` | `Signal<boolean>` | Se há usuário autenticado |
| `authLoading` | `Signal<boolean>` | Se está carregando autenticação |
| `authError` | `Signal<AuthErrorInfo \| null>` | Último erro de autenticação |
| `userId` | `Signal<string \| null>` | UID do usuário atual |
| `userEmail` | `Signal<string \| null>` | Email do usuário atual |

### Métodos Disponíveis

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `login(credentials)` | `Promise<AuthResult>` | Login com e-mail/senha |
| `logout()` | `Promise<AuthResult>` | Logout do usuário |
| `clearError()` | `void` | Limpa erro de autenticação |

### Tratamento de Erros

O serviço mapeia erros do Firebase para mensagens amigáveis:

| Código | Mensagem |
|--------|----------|
| `auth/invalid-email` | E-mail inválido. |
| `auth/user-not-found` | Usuário não encontrado. |
| `auth/wrong-password` | Senha incorreta. |
| `auth/invalid-credential` | Credenciais inválidas. Verifique e-mail e senha. |
| `auth/too-many-requests` | Muitas tentativas. Tente novamente mais tarde. |
| `auth/network-request-failed` | Erro de conexão. Verifique sua internet. |

---

## FirebaseClientService

Serviço centralizado para acessar instâncias do Firebase (Auth, Firestore, Storage).

### Uso

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';

@Component({...})
export class MeuComponente {
  private firebase = inject(FirebaseClientService);
  
  ngOnInit() {
    // Observar estado de autenticação
    this.firebase.getAuthState().subscribe(user => {
      if (user) {
        console.log('Usuário autenticado:', user.email);
      } else {
        console.log('Usuário não autenticado');
      }
    });
    
    // Obter instâncias diretas
    const auth = this.firebase.getAuth();
    const firestore = this.firebase.getFirestore();
    const storage = this.firebase.getStorage();
  }
}
```

### Métodos Disponíveis

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `getAuth()` | `Auth` | Instância do Firebase Auth |
| `getFirestore()` | `Firestore` | Instância do Firestore |
| `getStorage()` | `Storage` | Instância do Firebase Storage |
| `getAuthState()` | `Observable<User \| null>` | Observable do estado de autenticação |
| `getCurrentUser()` | `User \| null` | Usuário atual autenticado |

---

## NotificationService

Serviço de notificações (toasts/snackbars) para feedback visual ao usuário.

### Uso

```typescript
import { NotificationService } from '@core/services/notification.service';

@Component({...})
export class MeuComponente {
  private notification = inject(NotificationService);
  
  salvar() {
    // Sucesso
    this.notification.success('Dados salvos com sucesso!');
    
    // Erro
    this.notification.error('Falha ao salvar dados.');
    
    // Aviso
    this.notification.warning('Atenção: dados incompletos.');
    
    // Informação
    this.notification.info('Dica: use atalhos de teclado.');
    
    // Com opções
    this.notification.success('Item excluído!', {
      title: 'Sucesso',
      duration: 3000,
      action: {
        label: 'Desfazer',
        callback: () => this.desfazer()
      }
    });
  }
}
```

### Métodos Disponíveis

| Método | Retorno | Descrição |
|--------|---------|-----------|
| `success(message, options?)` | `string` | Exibe notificação de sucesso |
| `error(message, options?)` | `string` | Exibe notificação de erro |
| `warning(message, options?)` | `string` | Exibe notificação de aviso |
| `info(message, options?)` | `string` | Exibe notificação informativa |
| `dismiss(id)` | `void` | Remove uma notificação |
| `dismissAll()` | `void` | Remove todas as notificações |

### Opções

```typescript
interface NotificationOptions {
  title?: string;           // Título opcional
  duration?: number;        // Duração em ms (padrão: 5000)
  dismissible?: boolean;    // Se pode ser fechada (padrão: true)
  action?: {
    label: string;          // Texto do botão de ação
    callback: () => void;   // Função a executar
  };
}
```

### Signals Disponíveis

| Signal | Tipo | Descrição |
|--------|------|-----------|
| `notifications` | `Signal<Notification[]>` | Lista de notificações ativas |
| `hasNotifications` | `Signal<boolean>` | Se há notificações ativas |
| `notificationCount` | `Signal<number>` | Contagem de notificações |

---

**Última atualização:** Task 19 - Feedbacks de UX

