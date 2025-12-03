# **Refinamento Técnico – Meus Medicamentos - Sistema de Controle de Estoque de Medicamentos Familiares (MVP Frontend + API Node + Firebase)**

## **Visão Geral Arquitetural**

O **Meus Medicamentos - Sistema de Controle de Estoque Familiar de Medicamentos** será composto por:

* **Frontend:** Angular 18
* **Backend:** Node.js + Express
* **Firebase:** Authentication, Firestore, Storage e Cloud Functions

A aplicação permitirá que dois usuários (você e sua esposa) compartilhem o mesmo estoque de medicamentos, com foco em simplicidade extrema, usabilidade e alertas automáticos.

O MVP inicial terá **todas as operações essenciais** e será projetado para **evoluir facilmente** em direção a PWA, histórico, lotes, relatórios e outras funcionalidades futuras.

---

# 1. **Arquitetura Geral da Solução**

### **1.1 Componentes Principais**

| Camada           | Tecnologia              | Responsabilidades                                              |
| ---------------- | ----------------------- | -------------------------------------------------------------- |
| Frontend         | Angular 18              | UI/UX, cadastro, consulta, filtros, atualização de quantidade  |
| Backend          | Node.js API             | Regras server-side, sanitização, integração com Firebase Admin |
| Firebase Auth    | E-mail/Senha            | Login seguro dos usuários                                      |
| Firestore        | Base de dados principal | Coleção de medicamentos                                        |
| Firebase Storage | Imagens                 | Foto opcional do medicamento                                   |
| Cloud Functions  | Jobs e alertas          | Notificações de validade, vencimento e baixo estoque           |

---

# 2. **Estrutura Modular do Frontend (Angular 18)**

A estrutura segue o padrão moderno usado no refinamento original:

```
src/
  app/
    core/
      services/
      guards/
      interceptors/
      api/
      config/
    shared/
      components/
      directives/
      pipes/
      ui/
      models/
    features/
      auth/
      medicamentos/
        pages/
        components/
        services/
        models/
    layout/
      main-layout/
      auth-layout/

    app.config.ts
    app.routes.ts
```

### **2.1 Papéis dos Módulos**

* **core/**
  Serviços globais: AuthService, ErrorService, NotificationService, FirebaseService, ApiService.

* **shared/**
  Componentes reutilizáveis: cards, botões, inputs, listas, modal de confirmação.

* **features/medicamentos/**
  Toda a lógica do domínio: cadastro, edição, consulta, filtros, detalhes.

* **features/auth/**
  Login simples via Firebase Auth (email + senha).

* **layout/**
  Layout autenticado e layout de autenticação.

---

# 3. **Roteamento e Telas**

### **3.1 Rotas principais**

```
/login
/medicamentos
/medicamentos/novo
/medicamentos/:id
```

### **3.2 Telas da V1**

| Tela                    | Conteúdo                                    |
| ----------------------- | ------------------------------------------- |
| Lista de Medicamentos   | Busca, filtros, indicadores de status       |
| Cadastro de Medicamento | Formulário completo                         |
| Edição de Medicamento   | Atualizar quantidade, validade, observações |
| Visualização Detalhada  | Foto, informações completas                 |
| Login                   | Firebase Auth                               |

---

# 4. **Modelagem de Domínio (Frontend + API)**

## **4.1 Modelo `Medicamento`**

```ts
export interface Medicamento {
  id: string;
  nome: string;
  droga: string;
  generico: boolean;
  marca: string;
  laboratorio: string;
  tipo: string;
  validade: string; // ISO
  statusValidade: 'valido' | 'prestes' | 'vencido';
  quantidadeTotal: number;
  quantidadeAtual: number;
  fotoUrl?: string;
  observacoes?: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}
```

### **4.2 Regras de Negócio do Status de Validade**

* **vencido:** validade < hoje
* **prestes:** validade entre hoje e +15 dias / +30 dias (definido nas notificações)
* **válido:** acima de 30 dias

---

# 5. **Backend Node.js – Arquitetura**

Estrutura sugerida:

```
api/
  src/
    controllers/
    services/
    repositories/
    middlewares/
    routes/
    config/
    firebase/
```

### **5.1 Responsabilidades**

* Validar e sanitizar payloads
* Interagir com Firebase Admin
* Lógica de upload de imagem (Storage)
* Gerar status de validade automaticamente
* Endpoints CRUD

### **5.2 Endpoints**

```
POST   /auth/login
GET    /medicamentos
POST   /medicamentos
GET    /medicamentos/:id
PUT    /medicamentos/:id
PATCH  /medicamentos/:id/quantidade
DELETE /medicamentos/:id
```

---

# 6. **Firebase – Estrutura e Regras**

### **6.1 Firestore**

Coleção:

```
medicamentos/{id}
```

### **6.2 Regras de Segurança**

* Apenas usuários autenticados podem acessar
* Restrição por UID familiar (documento root “familia”)
* API realiza double-check via Firebase Admin

---

# 7. **Gerenciamento de Estado no Angular (Signals)**

Cada feature usará um store baseado em Signals conforme padrão do arquivo original.

### **7.1 Exemplo – `MedicamentosStore`**

```ts
@Injectable({ providedIn: 'root' })
export class MedicamentosStore {
  private readonly _items = signal<Medicamento[]>([]);
  private readonly _loading = signal(false);

  readonly items = computed(() => this._items());
  readonly loading = computed(() => this._loading());

  constructor(private api: MedicamentosApi) {}

  load() {
    this._loading.set(true);
    this.api.getAll().subscribe({
      next: data => {
        this._items.set(data);
        this._loading.set(false);
      }
    });
  }
}
```

---

# 8. **Notificações (Cloud Functions)**

Cloud Functions rodando diariamente:

### **8.1 Tarefas Automáticas**

| Notificação    | Critério                    |
| -------------- | --------------------------- |
| 30 dias antes  | validade <= hoje +30        |
| 15 dias antes  | validade <= hoje +15        |
| 7 dias antes   | validade <= hoje +7         |
| vencido        | validade < hoje             |
| baixo estoque  | quantidadeAtual < threshold |
| revisão mensal | todo dia 1 às 8h            |

Formato:
**E-mail via SendGrid ou Firebase Email Extensions**

---

# 9. **Experiência de Usuário (UX/UI)**

### **Princípios:**

* ações primárias sempre claras
* leitura rápida no mobile
* botões grandes
* filtros sempre à vista
* destaque visual para:

  * vencidos → vermelho
  * prestes a vencer → amarelo
  * válido → verde

### **9.1 Telas Críticas**

* lista em cartão com:

  * nome
  * quantidade atual
  * validade
  * badge de status
  * foto pequena opcional

* atualização de quantidade com 1 clique (+ / -)

---

# 10. **Roadmap Técnico**

## **V1 (MVP)** – 100% alinhado ao PRD

* Login (Firebase Auth)
* Cadastro, edição e remoção de medicamentos
* Foto opcional
* Consulta rápida + filtros principais
* Atualização de quantidade
* Notificações de validade e baixo estoque
* Revisão mensal

---

# 11. **Preparação para Evoluções**

### **V2**

* Histórico de alterações
* Lotes múltiplos
* Gráficos de consumo
* Autocomplete inteligente

### **V3**

* PWA com push notifications
* Categorias (dor, febre, gastro)
* QR code e scanner

### **V4**

* App nativo
* OCR de bula
* Reconhecimento de embalagens

---

# 12. **Critérios de Sucesso da V1**

A V1 será considerada bem-sucedida quando:

* cadastro < 1 minuto
* busca < 3 segundos
* notificações funcionando
* atualização rápida e intuitiva
* zero confusão de interface