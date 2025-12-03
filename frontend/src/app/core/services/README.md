# 🔥 Serviços Core - Firebase

Este diretório contém serviços globais relacionados ao Firebase.

## FirebaseClientService

Serviço centralizado para acessar instâncias do Firebase (Auth, Firestore, Storage).

### Uso

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';

@Component({...})
export class MeuComponente {
  constructor(private firebase: FirebaseClientService) {}
  
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

**Última atualização:** Task 7 - Setup do Firebase SDK

