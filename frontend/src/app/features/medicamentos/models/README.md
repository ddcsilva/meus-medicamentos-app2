# 📦 Modelos de Medicamento

Este diretório contém os modelos TypeScript e tipos relacionados ao domínio de Medicamentos.

---

## Interface Principal

### `Medicamento`

Interface principal que representa um medicamento completo no sistema.

```typescript
import { Medicamento } from '@features/medicamentos/models';

const medicamento: Medicamento = {
  id: 'abc123',
  nome: 'Paracetamol',
  droga: 'Paracetamol',
  generico: true,
  marca: 'Genérico',
  laboratorio: 'Lab XYZ',
  tipo: 'comprimido',
  validade: '2024-12-31',
  statusValidade: 'valido',
  quantidadeTotal: 20,
  quantidadeAtual: 15,
  fotoUrl: 'https://...',
  observacoes: 'Tomar com água',
  criadoPor: 'user123',
  criadoEm: '2024-01-01T00:00:00Z',
  atualizadoEm: '2024-01-01T00:00:00Z'
};
```

**Campos:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | `string` | ✅ | ID único gerado pelo Firestore |
| `nome` | `string` | ✅ | Nome comercial do medicamento |
| `droga` | `string` | ✅ | Nome da droga / princípio ativo |
| `generico` | `boolean` | ✅ | Se é medicamento genérico |
| `marca` | `string` | ✅ | Nome da marca |
| `laboratorio` | `string` | ✅ | Nome do laboratório |
| `tipo` | `TipoMedicamento \| string` | ✅ | Tipo de medicamento |
| `validade` | `string` | ✅ | Data de validade (ISO 8601) |
| `statusValidade` | `StatusValidade` | ✅ | Status calculado da validade |
| `quantidadeTotal` | `number` | ✅ | Quantidade total inicial |
| `quantidadeAtual` | `number` | ✅ | Quantidade atual disponível |
| `fotoUrl` | `string` | ❌ | URL da foto do medicamento |
| `observacoes` | `string` | ❌ | Observações adicionais |
| `criadoPor` | `string` | ✅ | UID do usuário criador |
| `criadoEm` | `string` | ✅ | Data de criação (ISO 8601) |
| `atualizadoEm` | `string` | ✅ | Data da última atualização (ISO 8601) |

---

## Tipos Auxiliares

### `StatusValidade`

Union type para o status de validade do medicamento.

```typescript
type StatusValidade = 'valido' | 'prestes' | 'vencido';
```

**Valores:**

- `'valido'`: Validade > 30 dias
- `'prestes'`: Validade entre hoje e +30 dias
- `'vencido'`: Validade < hoje

### `TipoMedicamento`

Union type para tipos de medicamento pré-definidos.

```typescript
type TipoMedicamento =
  | 'comprimido'
  | 'capsula'
  | 'liquido'
  | 'spray'
  | 'creme'
  | 'pomada'
  | 'gel'
  | 'gotas'
  | 'injetavel'
  | 'outro';
```

---

## DTOs (Data Transfer Objects)

### `CreateMedicamentoDto`

DTO para criação de um novo medicamento. Campos obrigatórios sem metadados.

```typescript
import { CreateMedicamentoDto } from '@features/medicamentos/models';

const novoMedicamento: CreateMedicamentoDto = {
  nome: 'Paracetamol',
  droga: 'Paracetamol',
  generico: true,
  marca: 'Genérico',
  laboratorio: 'Lab XYZ',
  tipo: 'comprimido',
  validade: '2024-12-31',
  quantidadeTotal: 20,
  quantidadeAtual: 20
};
```

### `UpdateMedicamentoDto`

DTO para atualização parcial de um medicamento. Todos os campos são opcionais.

```typescript
import { UpdateMedicamentoDto } from '@features/medicamentos/models';

const atualizacao: UpdateMedicamentoDto = {
  quantidadeAtual: 15,
  observacoes: 'Atualizado após uso'
};
```

### `UpdateQuantidadeDto`

DTO específico para atualização rápida de quantidade.

```typescript
import { UpdateQuantidadeDto } from '@features/medicamentos/models';

const atualizacaoQuantidade: UpdateQuantidadeDto = {
  quantidadeAtual: 10
};
```

### `MedicamentoResponseDto`

DTO de resposta da API. Representa o formato retornado pelo backend.

---

## Funções Utilitárias

### `mapResponseToMedicamento(dto: MedicamentoResponseDto): Medicamento`

Converte um DTO de resposta da API para o modelo `Medicamento`.

```typescript
import { mapResponseToMedicamento } from '@features/medicamentos/models';

const medicamento = mapResponseToMedicamento(responseDto);
```

### `mapMedicamentoToCreateDto(medicamento: Partial<Medicamento>): CreateMedicamentoDto`

Converte um modelo `Medicamento` para DTO de criação.

```typescript
import { mapMedicamentoToCreateDto } from '@features/medicamentos/models';

const dto = mapMedicamentoToCreateDto(medicamento);
```

### `mapMedicamentoToUpdateDto(medicamento: Partial<Medicamento>): UpdateMedicamentoDto`

Converte um modelo `Medicamento` para DTO de atualização.

```typescript
import { mapMedicamentoToUpdateDto } from '@features/medicamentos/models';

const dto = mapMedicamentoToUpdateDto(medicamento);
```

### `calcularStatusValidade(validade: string): StatusValidade`

Calcula o status de validade baseado na data.

```typescript
import { calcularStatusValidade } from '@features/medicamentos/models';

const status = calcularStatusValidade('2024-12-31');
// Retorna: 'valido' | 'prestes' | 'vencido'
```

**Regras de cálculo:**

- **vencido**: validade < hoje
- **prestes**: validade entre hoje e +30 dias
- **válido**: validade > +30 dias

### `isValidDate(validade: string): boolean`

Valida se uma data está no formato correto (YYYY-MM-DD).

```typescript
import { isValidDate } from '@features/medicamentos/models';

if (isValidDate('2024-12-31')) {
  // Data válida
}
```

---

## Uso em Serviços e Stores

```typescript
import {
  Medicamento,
  CreateMedicamentoDto,
  UpdateMedicamentoDto,
  mapResponseToMedicamento
} from '@features/medicamentos/models';

@Injectable({ providedIn: 'root' })
export class MedicamentosService {
  async criar(dto: CreateMedicamentoDto): Promise<Medicamento> {
    const response = await this.http.post<MedicamentoResponseDto>('/medicamentos', dto);
    return mapResponseToMedicamento(response);
  }
}
```

---

## Importações Recomendadas

Use o barrel file para importações limpas:

```typescript
// ✅ Recomendado
import {
  Medicamento,
  CreateMedicamentoDto,
  StatusValidade,
  calcularStatusValidade
} from '@features/medicamentos/models';

// ❌ Evitar
import { Medicamento } from '@features/medicamentos/models/medicamento.model';
```

---

**Última atualização:** Task 11 - Modelo Medicamento e tipos compartilhados

