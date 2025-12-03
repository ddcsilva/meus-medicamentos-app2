# ⚙️ Configuração Core

Este diretório contém arquivos de configuração da aplicação.

## Firebase Config

### `firebase.config.ts`

Fornece a configuração do Firebase extraída do environment e funções de validação.

#### Funções Exportadas

- `firebaseConfig` - Objeto de configuração do Firebase
- `validateFirebaseConfig()` - Valida se as configurações estão corretas

#### Uso

```typescript
import { firebaseConfig, validateFirebaseConfig } from '@core/config/firebase.config';

// Validar antes de usar
if (validateFirebaseConfig()) {
  // Configuração válida
  console.log('Firebase config:', firebaseConfig);
} else {
  // Configuração inválida
  console.error('Firebase não está configurado corretamente');
}
```

---

## Environment Service

### `environment.service.ts`

Serviço centralizado para acessar configurações de ambiente.

Veja a documentação em `src/environments/README.md`.

---

**Última atualização:** Task 7 - Setup do Firebase SDK

