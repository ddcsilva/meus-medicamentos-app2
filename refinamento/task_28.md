## Task 28 – Upload de imagem de medicamento via Storage

### Nome da Task
Implementar upload de imagem de medicamento usando Firebase Storage

### Objetivo
Criar o fluxo de upload de imagem de medicamento, integrando frontend e backend com Firebase Storage, armazenando a URL da foto no documento do medicamento.

### Principais entregas
- **Endpoint de upload**: rota na API (`POST /medicamentos/:id/foto` ou similar) recebendo arquivo multipart.
- **Integração com Storage**: uso do Firebase Admin para enviar o arquivo ao Storage e obter URL pública ou assinada.
- **Atualização do documento**: repositório/serviço atualizando o campo `fotoUrl` do medicamento.
- **Integração no frontend**: campo de upload no formulário de medicamento, enviando arquivo para o endpoint de upload.

### Critério de pronto
- [ ] O usuário consegue anexar uma foto no cadastro/edição e vê-la na visualização/detalhe.
- [ ] O backend armazena a imagem no Storage e guarda a URL em `fotoUrl`.
- [ ] São tratados erros de upload (tamanho, tipo de arquivo) com mensagens amigáveis.
- [ ] A implementação está preparada para evoluir para uploads diretos ao Storage, se desejado.

### Prompt de execução
Implemente na API Node.js um endpoint para upload de imagem de medicamento, utilizando middleware de upload (como `multer`), integrando com Firebase Storage via Admin SDK para armazenar o arquivo e salvar a URL resultante no campo `fotoUrl` do documento `medicamentos/{id}`. No frontend Angular, adicione um campo de upload de imagem no formulário de medicamento que envie o arquivo para esse endpoint durante o cadastro/edição, exibindo a imagem na tela de detalhes ao final.


