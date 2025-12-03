## Task 33 – Preparação estrutural para testes (frontend e backend)

### Nome da Task
Configurar base para testes futuros sem implementar casos

### Objetivo
Configurar o ambiente e a arquitetura de código para permitir criação fácil de testes de unidade e integração no futuro, sem escrever efetivamente os testes neste momento.

### Principais entregas
- **Configuração de testes no frontend**: confirmação/ajuste da configuração padrão do Angular (ou integração com Jest/Vitest, se escolhido).
- **Configuração de testes na API**: setup de framework de testes (ex.: Jest) com `ts-jest` ou similar.
- **Pontos de injeção/mocks**: ajustes mínimos em serviços para permitir injeção de dependências e mocks (por exemplo, interfaces para repositórios).
- **Documentação**: breve guia em `TESTING.md` explicando como criar novos testes nas camadas principais.

### Critério de pronto
- [ ] Frontend e API possuem comandos de teste (`npm test` ou equivalente) que rodam sem testes concretos.
- [ ] As principais dependências (repositórios, serviços externos) podem ser mockadas.
- [ ] Os stores e serviços estão organizados de maneira a permitir testes de unidade sem Angular/Express reais.
- [ ] A documentação indica onde colocar futuros arquivos de teste para cada camada.

### Prompt de execução
Configure o ambiente de testes para o frontend Angular e para a API Node.js, escolhendo um framework unificado quando possível (por exemplo, Jest) e garantindo que os comandos `test` sejam executáveis mesmo sem casos implementados. Ajuste levemente a arquitetura (injeção de dependências, interfaces) para facilitar mocks e crie um `TESTING.md` resumindo a abordagem de testes recomendada para stores, serviços, repositórios e controllers.


