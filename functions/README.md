# Cloud Functions - Meus Medicamentos

Firebase Cloud Functions para notificações automáticas do sistema de controle de estoque familiar de medicamentos.

## Tecnologias

- Firebase Cloud Functions
- TypeScript
- Node.js 18+

## Funcionalidades Planejadas

### Notificações de Validade
- Alerta 30 dias antes do vencimento
- Alerta 15 dias antes do vencimento
- Alerta 7 dias antes do vencimento
- Alerta no dia do vencimento

### Notificações de Estoque
- Alerta quando quantidade abaixo do threshold

### Revisão Mensal
- E-mail mensal lembrando revisar medicamentos

## Estrutura (a ser criada)

```
src/
  index.ts              # Ponto de entrada das funções
  notifications/        # Funções de notificação
    validade.ts         # Alertas de validade
    estoque.ts          # Alertas de estoque baixo
    revisao.ts          # Revisão mensal
  utils/                # Utilitários compartilhados
  config/               # Configurações
```

## Scripts

```bash
npm run build     # Compilar TypeScript
npm run serve     # Emulador local
npm run deploy    # Deploy para Firebase
npm run logs      # Ver logs das funções
```

## Configuração

Configurar variáveis de ambiente do Firebase:

```bash
firebase functions:config:set email.api_key="SUA_CHAVE_SENDGRID"
```

