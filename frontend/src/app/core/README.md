# Core Module

Módulo central da aplicação contendo serviços globais, guards, interceptors e configurações compartilhadas.

## Estrutura

- **services/** - Serviços globais (AuthService, ErrorService, NotificationService, FirebaseService, ApiService)
- **guards/** - Guards de roteamento (AuthGuard, etc.)
- **interceptors/** - Interceptors HTTP (AuthInterceptor, ErrorInterceptor, etc.)
- **api/** - Configuração e serviços de API HTTP
- **config/** - Configurações globais da aplicação

## Regras

- Todos os serviços aqui são `providedIn: 'root'`
- Guards e interceptors são registrados em `app.config.ts`
- Configurações são tipadas e exportadas como constantes ou objetos

