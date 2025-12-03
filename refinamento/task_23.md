## Task 23 – Repositório de Medicamentos com Firestore

### Nome da Task
Implementar repositório de acesso ao Firestore para medicamentos

### Objetivo
Criar a camada de repositório responsável por ler e escrever documentos na coleção `medicamentos` do Firestore, encapsulando detalhes de persistência.

### Principais entregas
- **Repositório**: classe ou conjunto de funções em `repositories/medicamentos.repository.ts`.
- **Operações básicas**: `findAll`, `findById`, `create`, `update`, `updateQuantidade`, `delete`.
- **Uso do Firebase Admin**: interação com Firestore via Admin SDK e coleção `medicamentos`.
- **Tratamento de erros**: mapeamento de erros de Firestore para erros de domínio ou HTTP apropriados.

### Critério de pronto
- [ ] Todas as operações CRUD na coleção `medicamentos` são implementadas no repositório.
- [ ] O repositório não contém lógica de negócio (apenas persistência).
- [ ] O repositório é injetável/instanciável de forma isolada, facilitando mock em testes.
- [ ] Erros de documentos inexistentes e problemas de conexão são tratados consistentemente.

### Prompt de execução
Na API Node.js, implemente um repositório de medicamentos utilizando o Firestore via Firebase Admin SDK, encapsulando as operações CRUD e de atualização de quantidade sobre a coleção `medicamentos`. Mantenha a responsabilidade do repositório focada em persistência, retornando e recebendo modelos de domínio ou DTOs tipados, e prepare a classe/funções para serem utilizadas pela camada de serviço de domínio.


