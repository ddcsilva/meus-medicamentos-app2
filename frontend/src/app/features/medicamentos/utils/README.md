# Utilitários de Medicamentos

Este diretório contém funções utilitárias puras para manipulação de medicamentos.

## Arquivos

### `medicamentos-filter.utils.ts`

Funções puras para filtrar e ordenar listas de medicamentos.

#### Características

- **Funções puras**: Sem side effects, fáceis de testar
- **Sem dependência de Angular**: Podem ser usadas em qualquer contexto
- **Fortemente tipadas**: Interfaces claras para filtros

## Funções de Filtro

### `filtrarPorBusca(medicamentos, busca)`

Filtra medicamentos por texto em nome, droga, marca ou laboratório.

```typescript
const resultado = filtrarPorBusca(medicamentos, "paracetamol");
```

### `filtrarPorStatus(medicamentos, status)`

Filtra por status de validade.

```typescript
const validos = filtrarPorStatus(medicamentos, "valido");
const prestes = filtrarPorStatus(medicamentos, "prestes");
const vencidos = filtrarPorStatus(medicamentos, "vencido");
```

### `filtrarPorTipo(medicamentos, tipo)`

Filtra por tipo de medicamento.

```typescript
const comprimidos = filtrarPorTipo(medicamentos, "comprimido");
```

### `filtrarPorGenerico(medicamentos, generico)`

Filtra por genérico ou referência.

```typescript
const genericos = filtrarPorGenerico(medicamentos, true);
const referencia = filtrarPorGenerico(medicamentos, false);
```

### `filtrarPorLaboratorio(medicamentos, laboratorio)`

Filtra por laboratório.

```typescript
const medley = filtrarPorLaboratorio(medicamentos, "Medley");
```

### `filtrarPorQuantidadeBaixa(medicamentos, limite)`

Filtra medicamentos com estoque baixo (> 0 e < limite).

```typescript
const baixoEstoque = filtrarPorQuantidadeBaixa(medicamentos, 5);
```

### `filtrarSemEstoque(medicamentos)`

Filtra medicamentos sem estoque (quantidade = 0).

```typescript
const semEstoque = filtrarSemEstoque(medicamentos);
```

## Funções de Ordenação

### `ordenarMedicamentos(medicamentos, campo, direcao)`

Ordena por campo específico.

```typescript
const porNome = ordenarMedicamentos(medicamentos, "nome", "asc");
const porValidade = ordenarMedicamentos(medicamentos, "validade", "desc");
```

Campos disponíveis:

- `nome`
- `droga`
- `validade`
- `quantidadeAtual`
- `criadoEm`
- `atualizadoEm`

## Função Principal

### `aplicarFiltros(medicamentos, filtros)`

Aplica todos os filtros e ordenação de uma vez.

```typescript
const resultado = aplicarFiltros(medicamentos, {
  busca: "paracetamol",
  status: "valido",
  tipo: "comprimido",
  ordenarPor: "nome",
  ordem: "asc",
});
```

## Funções Auxiliares

### `extrairLaboratorios(medicamentos)`

Extrai lista única de laboratórios (para dropdowns).

```typescript
const labs = extrairLaboratorios(medicamentos);
// ['EMS', 'Medley', 'Sanofi']
```

### `extrairTipos(medicamentos)`

Extrai lista única de tipos (para dropdowns).

```typescript
const tipos = extrairTipos(medicamentos);
// ['capsula', 'comprimido']
```

### `contarPorStatus(medicamentos)`

Conta medicamentos por status.

```typescript
const contagem = contarPorStatus(medicamentos);
// { valido: 10, prestes: 3, vencido: 2 }
```

### `temFiltrosAtivos(filtros)`

Verifica se há filtros ativos.

```typescript
if (temFiltrosAtivos(filtros)) {
  // Mostrar botão "Limpar filtros"
}
```

## Uso no Store

O `MedicamentosStore` usa essas funções via `computed`:

```typescript
readonly filteredItems = computed(() => {
  return aplicarFiltros(this._items(), this._filters());
});

readonly hasActiveFilters = computed(() => {
  return temFiltrosAtivos(this._filters());
});

readonly laboratoriosDisponiveis = computed(() => {
  return extrairLaboratorios(this._items());
});
```

## Testes

Os testes estão em `medicamentos-filter.utils.spec.ts` e cobrem:

- Filtros individuais
- Ordenação
- Combinação de filtros
- Funções auxiliares

