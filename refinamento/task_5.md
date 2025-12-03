## Task 5 – Configuração de estilos, tema e componentes de UI base

### Nome da Task
Definir tema visual inicial e componentes de UI reutilizáveis

### Objetivo
Configurar estilos globais, tema base (cores, tipografia) e criar alguns componentes de UI compartilhados essenciais (botões, cards e badges) para suportar a UX descrita no PRD.

### Principais entregas
- **Tema global**: definição de paleta de cores (verde para válido, amarelo para prestes a vencer, vermelho para vencido) e tipografia padrão.
- **Estilos responsivos**: uso de Flexbox/CSS Grid com breakpoints simples para mobile/desktop.
- **Componentes de UI base**: componentes em `shared/ui` como `Button`, `Card`, `BadgeStatus` (standalone).
- **Integração opcional com Angular Material**: se utilizado, configuração mínima de tema e import de módulos necessários via providers.

### Critério de pronto
- [ ] O tema de cores e tipografia está centralizado em variáveis SCSS ou similar.
- [ ] Os componentes de UI base podem ser usados em qualquer página sem duplicação de estilos.
- [ ] A aplicação exibe visual consistente em resoluções mobile e desktop.
- [ ] As cores de status (verde, amarelo, vermelho) estão disponíveis para uso nas próximas tasks.

### Prompt de execução
No projeto Angular, configure estilos globais em `styles.scss` com paleta de cores e tipografia, e crie componentes standalone em `shared/ui` para botão primário, card e badge de status de medicamento. Garanta que esses componentes sejam responsivos, fáceis de reutilizar nas páginas de login e medicamentos, e que utilizem as cores definidas para representar os status de validade conforme o PRD.


