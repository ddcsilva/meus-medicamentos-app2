# 🔥 Setup do Firebase - Meus Medicamentos

Este documento descreve a configuração do Firebase no frontend Angular.

## 📦 Dependências

O projeto utiliza:
- `@angular/fire` (v18+) - Integração Angular com Firebase
- `firebase` (v10+) - SDK do Firebase

## 🏗️ Arquitetura

### Providers no `app.config.ts`

Os providers do Firebase são configurados no `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // Firebase App
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    
    // Firebase Auth
    provideAuth(() => getAuth()),
    
    // Firebase Firestore
    provideFirestore(() => getFirestore()),
    
    // Firebase Storage
    provideStorage(() => getStorage())
  ]
};
```

### Configuração

A configuração do Firebase é extraída do `environment`:

- **Desenvolvimento:** `environment.development.ts`
- **Produção:** `environment.ts`

### Validação

A função `validateFirebaseConfig()` valida se todas as credenciais estão presentes antes de inicializar o Firebase.

## 🚀 Como Usar

### 1. Acessar Instâncias do Firebase

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';

constructor(private firebase: FirebaseClientService) {
  // Obter instâncias
  const auth = this.firebase.getAuth();
  const firestore = this.firebase.getFirestore();
  const storage = this.firebase.getStorage();
}
```

### 2. Observar Estado de Autenticação

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';

constructor(private firebase: FirebaseClientService) {}

ngOnInit() {
  this.firebase.getAuthState().subscribe(user => {
    if (user) {
      console.log('Usuário autenticado:', user.email);
    } else {
      console.log('Usuário não autenticado');
    }
  });
}
```

### 3. Obter Usuário Atual

```typescript
const currentUser = this.firebase.getCurrentUser();
if (currentUser) {
  console.log('UID:', currentUser.uid);
  console.log('Email:', currentUser.email);
}
```

## 📝 Exemplos de Uso

### Exemplo: Autenticação

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';
import { signInWithEmailAndPassword } from '@angular/fire/auth';

constructor(private firebase: FirebaseClientService) {}

async login(email: string, password: string) {
  const auth = this.firebase.getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login realizado:', userCredential.user);
  } catch (error) {
    console.error('Erro no login:', error);
  }
}
```

### Exemplo: Firestore

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';
import { collection, getDocs } from '@angular/fire/firestore';

constructor(private firebase: FirebaseClientService) {}

async getMedicamentos() {
  const firestore = this.firebase.getFirestore();
  const medicamentosRef = collection(firestore, 'medicamentos');
  const snapshot = await getDocs(medicamentosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### Exemplo: Storage

```typescript
import { FirebaseClientService } from '@core/services/firebase-client.service';
import { ref, uploadBytes } from '@angular/fire/storage';

constructor(private firebase: FirebaseClientService) {}

async uploadFoto(file: File, path: string) {
  const storage = this.firebase.getStorage();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
}
```

## ✅ Checklist de Configuração

- [x] `@angular/fire` e `firebase` instalados no `package.json`
- [x] Credenciais do Firebase configuradas no `environment.development.ts`
- [x] Credenciais do Firebase configuradas no `environment.ts`
- [x] Providers do Firebase configurados no `app.config.ts`
- [x] `FirebaseClientService` criado e funcionando
- [x] Validação de configuração implementada
- [x] Aplicação inicializa sem erros no console

## 🔍 Troubleshooting

### Erro: "Firebase configuration is invalid"

**Causa:** Credenciais do Firebase não configuradas ou inválidas.

**Solução:**
1. Verifique se as credenciais estão corretas no `environment.development.ts`
2. Confirme que não há valores placeholder (`YOUR_*`)
3. Verifique o console para ver qual campo está faltando

### Erro: "No Firebase App '[DEFAULT]' has been created"

**Causa:** Firebase não foi inicializado corretamente.

**Solução:**
1. Verifique se os providers estão no `app.config.ts`
2. Confirme que `validateFirebaseConfig()` retorna `true`
3. Verifique se não há erros no console durante a inicialização

### Erro: "Cannot find module '@angular/fire/auth'"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
cd frontend
npm install
```

---

**Última atualização:** Task 7 - Setup do Firebase SDK

