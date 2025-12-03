# Features Module

Módulos de funcionalidades da aplicação. Cada feature é auto-contida com suas próprias páginas, componentes, serviços e modelos.

## Estrutura por Feature

Cada feature segue a mesma estrutura:

```
feature-name/
  pages/          # Páginas/rotas da feature
  components/     # Componentes específicos da feature
  services/       # Serviços específicos da feature
  models/         # Modelos e interfaces da feature
```

## Features Atuais

### Auth
- **Páginas:** Login, Registro (futuro)
- **Componentes:** Formulários de autenticação
- **Serviços:** Lógica de autenticação específica
- **Models:** User, LoginRequest, etc.

### Medicamentos
- **Páginas:** Lista, Cadastro, Edição, Detalhes
- **Componentes:** Cards, Formulários, Filtros, Badges de status
- **Serviços:** CRUD de medicamentos, lógica de negócio
- **Models:** Medicamento, Filtros, Status, etc.

## Regras

- Cada feature é independente e pode ser lazy-loaded
- Componentes e serviços são standalone
- Models são interfaces TypeScript exportadas
- Páginas são componentes standalone que podem ser usados diretamente nas rotas

