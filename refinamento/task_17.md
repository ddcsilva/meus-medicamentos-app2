## Task 17 – Lógica de filtros, busca e ordenação de medicamentos

### Nome da Task
Implementar filtros, busca textual e ordenação na lista

### Objetivo
Adicionar lógica de aplicação de filtros rápidos, busca por nome/droga e ordenação (por validade, nome, quantidade), conforme experiência de consulta rápida descrita no PRD.

### Principais entregas
- **Modelo de filtros**: tipo/interface de filtros em `features/medicamentos/models`.
- **Funções puras de filtro/ordenação**: helpers em arquivo utilitário (ex.: `medicamentos-filter.utils.ts`).
- **Integração com store**: `MedicamentosStore` aplicando filtros e ordenação via `computed`.
- **Wire-up com UI**: barra de filtros/busca atualizando o estado de filtros do store.

### Critério de pronto
- [ ] É possível buscar por nome do medicamento ou droga na lista.
- [ ] Filtros por tipo, validade, quantidade baixa, genérico/referência e laboratório funcionam corretamente.
- [ ] Ordenação pode ser alterada entre pelo menos dois critérios (ex.: validade ascendente, nome alfabético).
- [ ] A lógica de filtros é testável (funções puras, sem dependência de Angular).

### Prompt de execução
Implemente no frontend Angular a lógica de filtros, busca e ordenação da lista de medicamentos, definindo um modelo de filtros e funções utilitárias puras para aplicar esses critérios sobre uma lista de `Medicamento`. Integre essas funções ao `MedicamentosStore` via `computed` e conecte-as à barra de filtros/busca, garantindo que o usuário consiga restringir rapidamente a lista conforme os requisitos do PRD.


