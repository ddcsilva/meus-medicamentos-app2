## Task 15 – Páginas do módulo de Medicamentos (lista, novo, detalhes, edição)

### Nome da Task
Criar páginas principais da feature `medicamentos`

### Objetivo
Implementar as páginas necessárias para o fluxo completo de medicamentos: listagem, cadastro, visualização detalhada e edição, conectadas ao `MedicamentosStore`.

### Principais entregas
- **Página de lista**: em `features/medicamentos/pages/lista` exibindo cartões de medicamentos com status, validade e quantidade.
- **Página de novo medicamento**: formulário completo de cadastro com campos definidos no PRD.
- **Página de detalhes**: visualização focada de um medicamento, incluindo foto opcional e observações.
- **Página de edição**: reutilização do formulário para atualização de dados de um medicamento existente.

### Critério de pronto
- [ ] As rotas `/medicamentos`, `/medicamentos/novo` e `/medicamentos/:id` estão mapeadas para páginas funcionais.
- [ ] Todas as páginas consomem dados via `MedicamentosStore`.
- [ ] Formulários contêm validações mínimas (campos obrigatórios, tipos corretos).
- [ ] A navegação entre lista, detalhes, edição e novo está fluida e sem erros.

### Prompt de execução
Na feature `medicamentos` do Angular, crie páginas standalone para listagem, criação, visualização detalhada e edição de medicamentos, utilizando o `MedicamentosStore` para carregar e persistir dados. Implemente formulários reativos com os campos descritos no PRD (`nome`, `droga`, `generico`, `marca`, `laboratorio`, `tipo`, `validade`, quantidades, observações, foto opcional) e configure as rotas previstas (`/medicamentos`, `/medicamentos/novo`, `/medicamentos/:id`), garantindo usabilidade simples e responsiva.


