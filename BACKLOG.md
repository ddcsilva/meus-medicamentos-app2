# 📋 Backlog - Meus Medicamentos

Este documento contém os itens de backlog identificados durante a revisão do MVP, organizados por versão futura.

---

## ✅ MVP (V1) - Concluído

### Funcionalidades Implementadas

- [x] Setup Angular 18 com standalone components e signals
- [x] Estrutura de pastas (core, shared, features, layout)
- [x] Firebase Auth no frontend
- [x] Firebase Firestore no frontend e backend
- [x] Firebase Storage para fotos
- [x] API Node.js + Express + TypeScript
- [x] Firebase Admin SDK no backend
- [x] Modelos e DTOs tipados
- [x] CRUD completo de medicamentos (frontend e backend)
- [x] Upload de fotos
- [x] Store com Signals para estado
- [x] Páginas e componentes do módulo medicamentos
- [x] Autenticação com Firebase Auth
- [x] Guards de rota
- [x] Integração frontend ↔ backend
- [x] Filtros, busca e ordenação
- [x] Lógica de validade e status
- [x] Atualização de quantidade (+/-)
- [x] UX base (cards, layout, feedback)
- [x] Configuração de ambientes
- [x] Preparação estrutural para Cloud Functions
- [x] Preparação para testes

---

## 🔜 V2 - Histórico e Melhorias

### Funcionalidades

- [ ] **Histórico de Alterações**
  - Registrar todas as alterações em medicamentos
  - Visualização de timeline por medicamento
  - Filtros por data e tipo de alteração
  - Exportação de histórico

- [ ] **Lotes Múltiplos**
  - Suporte a múltiplos lotes por medicamento
  - Validades diferentes por lote
  - Controle de estoque por lote
  - FIFO automático (primeiro a vencer, primeiro a usar)

- [ ] **Gráficos e Relatórios**
  - Dashboard com estatísticas visuais
  - Gráfico de consumo mensal
  - Relatório de medicamentos vencidos
  - Previsão de reposição

- [ ] **Melhorias de UX**
  - Modo escuro
  - Animações de transição
  - Skeleton loading
  - Infinite scroll na listagem

### Técnico

- [ ] Implementar testes unitários (cobertura > 70%)
- [ ] Implementar testes de integração
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento com Firebase Analytics
- [ ] Logs estruturados (Winston/Pino)

---

## 🚀 V3 - PWA e Notificações

### Funcionalidades

- [ ] **PWA (Progressive Web App)**
  - Service Worker para offline
  - Manifest para instalação
  - Cache de dados críticos
  - Sincronização em background

- [ ] **Push Notifications**
  - Notificações de validade próxima
  - Alerta de estoque baixo
  - Lembrete de revisão mensal
  - Configurações de preferência

- [ ] **Categorias de Medicamentos**
  - Criar e gerenciar categorias
  - Filtrar por categoria
  - Ícones personalizados

- [ ] **QR Code**
  - Gerar QR Code do medicamento
  - Escanear para busca rápida
  - Compartilhar via QR Code

- [ ] **Compartilhamento Familiar**
  - Convidar membros da família
  - Permissões de acesso
  - Visualização compartilhada
  - Notificações para todos

### Técnico

- [ ] Implementar Cloud Functions de notificação
- [ ] Integração com FCM (Firebase Cloud Messaging)
- [ ] Testes E2E com Cypress/Playwright
- [ ] Performance optimization (lazy loading, code splitting)

---

## 🌟 V4 - App Nativo e Integrações

### Funcionalidades

- [ ] **App Nativo**
  - React Native ou Flutter
  - Funcionalidades nativas (câmera, notificações)
  - Widgets de home screen
  - Sincronização offline

- [ ] **OCR de Bula**
  - Escanear bula do medicamento
  - Extrair informações automaticamente
  - Preencher formulário automaticamente

- [ ] **Integrações Farmacêuticas**
  - Busca de preços em farmácias
  - Comparação de preços
  - Alertas de promoções
  - Localização de farmácias próximas

- [ ] **Receitas Médicas**
  - Upload de receitas
  - Vinculação com medicamentos
  - Lembretes de renovação
  - Histórico de receitas

- [ ] **Lembretes de Medicação**
  - Configurar horários de uso
  - Notificações de lembrete
  - Registro de doses tomadas
  - Relatório de adesão

### Técnico

- [ ] API de integrações externas
- [ ] Machine Learning para OCR
- [ ] Geolocalização
- [ ] Sincronização cross-platform

---

## 🐛 Bugs Conhecidos

| ID | Descrição | Severidade | Status |
|----|-----------|------------|--------|
| - | Nenhum bug crítico identificado | - | - |

---

## 💡 Melhorias de UX Identificadas

### Curto Prazo (Quick Wins)

1. **Feedback de ações**
   - Adicionar animação ao salvar
   - Confirmação visual ao deletar
   - Toast de sucesso mais visível

2. **Formulários**
   - Autocomplete de droga/medicamento
   - Sugestões de laboratórios
   - Validação em tempo real mais suave

3. **Listagem**
   - Ordenação por coluna (clicável)
   - Visualização em lista/grid
   - Seleção múltipla para ações em lote

### Médio Prazo

1. **Onboarding**
   - Tour guiado para novos usuários
   - Dicas contextuais
   - Exemplos de medicamentos

2. **Acessibilidade**
   - Suporte a leitores de tela
   - Alto contraste
   - Navegação por teclado completa

3. **Internacionalização**
   - Suporte a múltiplos idiomas
   - Formatos de data regionais
   - Unidades de medida locais

---

## 📊 Métricas de Sucesso (KPIs)

### MVP

- [ ] 100% das funcionalidades core funcionando
- [ ] Tempo de carregamento < 3s
- [ ] 0 erros críticos em produção

### V2

- [ ] Cobertura de testes > 70%
- [ ] Tempo de resposta API < 200ms
- [ ] Uptime > 99.9%

### V3+

- [ ] NPS > 50
- [ ] Retenção mensal > 60%
- [ ] MAU (Monthly Active Users) crescente

---

## 📝 Notas de Revisão

### Pontos Fortes

1. ✅ Arquitetura bem organizada e escalável
2. ✅ Tipagem forte em todo o projeto
3. ✅ Componentes reutilizáveis
4. ✅ Estado centralizado com Signals
5. ✅ Separação clara de responsabilidades
6. ✅ UX limpa e intuitiva

### Pontos de Atenção

1. ⚠️ Índices do Firestore precisam ser criados manualmente
2. ⚠️ Testes ainda não implementados
3. ⚠️ Cloud Functions são apenas stubs
4. ⚠️ Sem monitoramento de erros em produção

### Dívidas Técnicas

1. Implementar testes unitários
2. Configurar CI/CD
3. Adicionar logging estruturado
4. Implementar cache de dados
5. Otimizar bundle size

---

*Última atualização: Dezembro 2024*

