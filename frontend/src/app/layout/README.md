# Layout Module

Componentes de layout que envolvem as páginas da aplicação.

## Estrutura

- **main-layout/** - Layout principal para rotas autenticadas (header, footer, sidebar)
- **auth-layout/** - Layout para páginas de autenticação (login, registro)

## Uso

Os layouts são aplicados nas rotas através do roteamento do Angular. Cada layout contém um `<router-outlet>` onde as páginas são renderizadas.

## Componentes

- **MainLayoutComponent** - Layout com header, conteúdo e footer para área autenticada
- **AuthLayoutComponent** - Layout limpo e centrado para autenticação

