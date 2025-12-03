## Task 18 – Fluxo de atualização de quantidade (+ / -) no frontend

### Nome da Task
Implementar fluxo de incremento/decremento de quantidade atual

### Objetivo
Conectar o componente de controle de quantidade (+/-) ao `MedicamentosStore` e ao endpoint dedicado de atualização de quantidade, garantindo uma experiência rápida de ajuste após uso.

### Principais entregas
- **Eventos do componente de quantidade**: emissões claras de ações de incremento/decremento com o valor desejado.
- **Método no store**: `updateQuantidade` chamando `MedicamentosApi` e atualizando o estado local após sucesso.
- **Feedback visual**: loading local no controle ou card enquanto a atualização é enviada.
- **Tratamento de limites**: impedir valores negativos e, opcionalmente, limites superiores razoáveis.

### Critério de pronto
- [ ] O usuário consegue ajustar a quantidade atual diretamente da lista/detalhe usando os botões +/-.
- [ ] A quantidade exibida é atualizada após confirmação da API.
- [ ] Erros na atualização são comunicados ao usuário e não deixam o estado inconsistente.
- [ ] O fluxo é rápido e intuitivo, conforme descrito no refinamento (1 clique para atualizar).

### Prompt de execução
No frontend Angular, conecte o componente de controle de quantidade (+/-) ao `MedicamentosStore`, implementando o método `updateQuantidade` que chama o endpoint de PATCH de quantidade via `MedicamentosApi` e atualiza o estado local de forma otimista ou após confirmação. Adicione validações para impedir quantidades negativas, feedback visual de carregamento e mensagens de erro amigáveis em caso de falha, mantendo o fluxo de uso extremamente rápido.


