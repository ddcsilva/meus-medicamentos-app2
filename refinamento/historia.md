# 📄 **PRD – Meus Medicamentos - Sistema de Controle de Estoque de Medicamentos Familiares**

**Tecnologias:** Angular 18 (frontend), Node.js (API), Firebase Authentication, Firestore, Firebase Storage (foto opcional)

---

## 🎯 **1. Visão Geral do Produto**

O sistema tem como objetivo permitir que uma família (no caso, você e sua esposa) controle de forma fácil, rápida e organizada o estoque doméstico de medicamentos.
O foco principal é evitar desperdício, compras duplicadas e vencimentos silenciosos.

A solução será responsiva (mobile + desktop) e futuramente evoluirá para PWA e app.

---

## 👥 **2. Usuários**

* **Usuário principal** (admin inicial)
* **Usuário secundário** (sua esposa)
  Ambos possuem contas próprias via Firebase Auth, porém compartilham o *mesmo estoque familiar*.

Não há perfis nem permissões especiais por enquanto.

---

## 🧩 **3. Problema a Ser Resolvido**

Atualmente não existe uma forma rápida e confiável de saber:

* Quais medicamentos estão disponíveis em casa
* Em que quantidade
* Se estão vencidos ou próximos da validade
* Se precisam ser repostos
* Quais informações relevantes sobre cada medicamento

Isso gera:

* Gastos desnecessários
* Medicamentos vencidos acumulados
* Falta de organização
* Dificuldade ao consultar informações no consultório médico

---

## 🎯 **4. Objetivos do Produto**

* Facilitar o registro e consulta de medicamentos
* Notificar sobre validade e baixo estoque
* Permitir atualizar rapidamente quantidades após uso
* Ser extremamente simples de usar, com UI/UX priorizados
* Oferecer consulta rápida quando estiver no médico ou farmácia

---

## 🛠 **5. Escopo da Primeira Versão (MVP+)**

### 5.1 Cadastro de Medicamentos

Campos incluídos:

* Nome do medicamento
* Nome da droga / princípio ativo
* É genérico? (sim/não)
* Nome da marca
* Laboratório
* Tipo: comprimido, cápsula, líquido, spray, creme, pomada, etc.
* Validade
* Status (válido / prestes a vencer / vencido)
* Quantidade total inicial
* Quantidade atual
* Observações adicionais
* **Foto opcional** (caixa/bula/embalagem) via Firebase Storage

### 5.2 Sem Lotes (por enquanto)

Cada medicamento tem **uma única validade** e **uma única contagem**.
Lotes múltiplos serão adicionados no futuro.

---

### 5.3 Atualização de Quantidade

* Atualização manual
* Sem histórico por enquanto (será evoluído no futuro)

---

### 5.4 Experiência de Consulta Rápida

Funcionalidades da V1:

1. **Busca simples** por nome do medicamento ou droga
2. **Filtros rápidos**:

   * Tipo (comprimido, cápsula, etc.)
   * Validade (válidos, prestes a vencer, vencidos)
   * Quantidade baixa
   * Genérico / referência
   * Laboratório

Não incluído na V1:

* Categorias ("Dor", "Gastro" etc.)
* Comando por voz
* QR Code / código de barras

---

### 5.5 Notificações

Notificações por e-mail, via Firebase Cloud Functions:

#### 5.5.1 Validade

Enviar alertas:

* 30 dias antes
* 15 dias antes
* 7 dias antes
* Quando vencer (alerta de vencido)

#### 5.5.2 Baixo Estoque

Enviar alerta quando a quantidade atual estiver **abaixo de X unidades** (definir threshold por medicamento ou global, ex.: 5 unidades).

#### 5.5.3 Revisão Mensal do Estoque

* E-mail mensal lembrando revisar medicamentos

---

## 💻 **6. Interface e Experiência do Usuário**

Princípios:

* UI limpa e minimalista
* Navegação intuitiva
* Botões grandes e fáceis de clicar no mobile
* Fluxo rápido para registrar um novo medicamento
* Autocomplete para facilitar buscas (ideal na V2/V3)
* Design responsivo (mobile = desktop em prioridade)

---

## ☁️ **7. Arquitetura Técnica**

### 7.1 Frontend – Angular 18

* Angular Signals
* Angular Material (se desejado)
* Design responsivo (CSS Grid / Flex)
* Lazy loading de módulos
* PWA opcional em futuras versões

### 7.2 Backend – Node.js API

* API RESTful com Express
* Comunicação com Firebase Admin SDK
* Funções:

  * CRUD de medicamentos
  * Upload de imagens (Storage)
  * Gestão de usuários
  * Notificações (Cloud Functions integradas)

### 7.3 Firebase

* **Auth:** autenticação por e-mail/senha
* **Firestore:** armazenamento dos medicamentos
* **Storage:** fotos opcionais
* **Cloud Functions:** notificações automáticas

---

## 📊 **8. Estrutura de Dados (Firestore)**

### Documento: `medicamentos/{id}`

```
{
  nome: string,
  droga: string,
  generico: boolean,
  marca: string,
  laboratorio: string,
  tipo: string,
  validade: Timestamp,
  statusValidade: "valido" | "prestes" | "vencido",
  quantidadeTotal: number,
  quantidadeAtual: number,
  fotoUrl?: string,
  observacoes?: string,
  criadoPor: uid,
  criadoEm: Timestamp,
  atualizadoEm: Timestamp
}
```

---

## 🔒 **9. Segurança e Acessos**

* Apenas usuários autenticados podem acessar o sistema
* Regras de segurança do Firestore restringem acesso ao documento da família
* API Node faz verificação via Firebase Admin

---

## 🚧 **10. Roadmap Futuro**

Ordem sugerida:

### V2

* Histórico de alterações
* Lotes múltiplos por medicamento
* Gráficos de consumo
* Filtros avançados
* Autocomplete inteligente

### V3

* PWA com push notifications
* Categoria semântica de medicamentos
* QR Code e leitura de código de barras
* Widgets para atalho rápido no celular

### V4

* App nativo (Flutter, React Native ou Capacitor)
* Scanner de bula
* Reconhecimento via OCR
* Integrações com APIs farmacêuticas

---

## 📌 **11. Sucesso da V1**

A versão será bem-sucedida se:

* O usuário consegue cadastrar medicamentos em menos de 1 minuto
* É possível consultar rapidamente medicamentos quando estiver no médico
* Notificações de validade e baixo estoque chegam corretamente
* A experiência é simples e fluida, sem necessidade de tutorial

---