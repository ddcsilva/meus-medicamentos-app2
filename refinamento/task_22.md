## Task 22 – Modelos e DTOs de Medicamento na API

### Nome da Task
Definir modelos de domínio e DTOs de entrada/saída no backend

### Objetivo
Criar tipos e interfaces TypeScript para o domínio `Medicamento` na API Node, incluindo modelos internos, DTOs de criação/atualização e mapeamento para o formato do Firestore.

### Principais entregas
- **Modelo de domínio**: interface `Medicamento` no backend (`api/src/domain/medicamentos/medicamento.model.ts` ou similar).
- **DTOs**: `CreateMedicamentoDto`, `UpdateMedicamentoDto`, `UpdateQuantidadeDto`, `MedicamentoResponseDto`.
- **Tipos de status**: union type para `statusValidade` coerente com o frontend.
- **Funções de mapeamento**: helpers para converter entre DTOs, modelo de domínio e estrutura do documento Firestore.

### Critério de pronto
- [ ] O modelo de `Medicamento` no backend está alinhado com o modelo do frontend e o PRD.
- [ ] DTOs separam claramente payloads de entrada e respostas enviadas ao cliente.
- [ ] Não há uso de `any` nas camadas de domínio/repositório para o modelo de medicamentos.
- [ ] Helpers de mapeamento são funções puras e isoladas, prontas para teste.

### Prompt de execução
No projeto da API, defina o modelo de domínio `Medicamento` e os DTOs necessários (`CreateMedicamentoDto`, `UpdateMedicamentoDto`, `UpdateQuantidadeDto` e DTO de resposta) em arquivos organizados na pasta de domínio de medicamentos. Implemente funções puras para mapear entre esses tipos, o formato armazenado no Firestore e o formato devolvido ao frontend, mantendo o código fortemente tipado e fácil de evoluir.


