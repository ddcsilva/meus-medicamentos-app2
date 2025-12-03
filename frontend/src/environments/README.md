# 🌍 Configuração de Ambientes - Meus Medicamentos

Este diretório contém os arquivos de configuração de ambiente para diferentes contextos de execução.

## 📁 Arquivos

| Arquivo | Descrição | Quando usar |
|---------|-----------|-------------|
| `environment.interface.ts` | Interface TypeScript que define a estrutura de configuração | Referência de tipos |
| `environment.development.ts` | Configuração para desenvolvimento local | `ng serve` ou `ng build --configuration development` |
| `environment.ts` | Configuração para produção | `ng build --configuration production` |
| `environment.example.ts` | Template de exemplo | Documentação e referência |

## 🔧 Configuração

### 1. Configurar Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Role até **Seus apps** e selecione o app **Web** (ou crie um)
5. Copie as credenciais do objeto `firebaseConfig`

### 2. Atualizar Arquivos de Ambiente

#### Desenvolvimento (`environment.development.ts`)

```typescript
export const environment: Environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  firebase: {
    apiKey: 'SUA_API_KEY_AQUI',
    authDomain: 'seu-projeto.firebaseapp.com',
    projectId: 'seu-projeto',
    storageBucket: 'seu-projeto.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:abc123',
  },
  // ...
};
```

#### Produção (`environment.ts`)

```typescript
export const environment: Environment = {
  production: true,
  apiBaseUrl: 'https://api.exemplo.com/api',
  firebase: {
    apiKey: 'SUA_API_KEY_PRODUCAO',
    // ...
  },
  // ...
};
```

## 🔒 Segurança

### ⚠️ IMPORTANTE - Credenciais Sensíveis

1. **NUNCA** commite arquivos `environment*.ts` com credenciais reais no Git
2. Adicione `environment*.ts` ao `.gitignore` (exceto `.example.ts`)
3. Use variáveis de ambiente ou serviços de secrets para produção
4. Mantenha credenciais de produção separadas das de desenvolvimento

### Recomendações

#### Para Desenvolvimento Local
- Use `environment.development.ts` com credenciais de um projeto Firebase de teste
- Mantenha um arquivo `.env.local` (não versionado) se necessário

#### Para Produção
- Use variáveis de ambiente do sistema ou CI/CD
- Considere usar serviços como:
  - Firebase App Check para proteção adicional
  - Variáveis de ambiente do servidor
  - Secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

## 📖 Como Usar

### No Código

```typescript
import { environment } from '@environments/environment';

// Acessar configurações
const apiUrl = environment.apiBaseUrl;
const firebaseConfig = environment.firebase;
const isProduction = environment.production;
```

### Exemplo: Inicializar Firebase

```typescript
import { initializeApp } from 'firebase/app';
import { environment } from '@environments/environment';

const app = initializeApp(environment.firebase);
```

### Exemplo: Fazer Requisição à API

```typescript
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getMedicamentos() {
  return this.http.get(`${environment.apiBaseUrl}/medicamentos`);
}
```

## 🏗️ Estrutura da Interface

```typescript
interface Environment {
  production: boolean;
  apiBaseUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId?: string;
    appId: string;
    measurementId?: string;
  };
  app: {
    name: string;
    version: string;
    baseUrl: string;
  };
  features?: {
    experimental?: boolean;
    maintenance?: boolean;
  };
}
```

## 🔄 Build e Deploy

### Desenvolvimento
```bash
ng serve
# ou
ng build --configuration development
```

### Produção
```bash
ng build --configuration production
```

O Angular automaticamente substitui `environment.ts` pelo arquivo correto baseado na configuração.

## 📝 Checklist de Configuração

- [ ] Criar projeto no Firebase Console
- [ ] Obter credenciais do Firebase (apiKey, authDomain, projectId, etc.)
- [ ] Atualizar `environment.development.ts` com credenciais de desenvolvimento
- [ ] Atualizar `environment.ts` com credenciais de produção
- [ ] Verificar que `.gitignore` inclui `environment*.ts` (exceto `.example.ts`)
- [ ] Testar build de desenvolvimento: `ng build --configuration development`
- [ ] Testar build de produção: `ng build --configuration production`
- [ ] Documentar processo de configuração para a equipe

## 🆘 Troubleshooting

### Erro: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifique se as credenciais do Firebase estão corretas
- Confirme que `environment.firebase` está sendo usado corretamente

### Erro: "API base URL is not defined"
- Verifique se `environment.apiBaseUrl` está definido
- Confirme que o arquivo de environment correto está sendo importado

### Build falha com "Cannot find module '@environments/environment'"
- Verifique o path mapping no `tsconfig.json`
- Use import relativo: `import { environment } from '../environments/environment'`

---

**Última atualização:** Task 6 - Configuração de ambientes

