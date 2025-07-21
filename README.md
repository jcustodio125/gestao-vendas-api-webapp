
# 📦 Logap - Sistema Web de Vendas + API de Identificação de Vogais

Este projeto foi desenvolvido para atender dois desafios principais:

- **🔡 Tarefa 1**: Criar uma API RESTful que identifica a primeira vogal seguindo regras específicas de posição e repetição.
- **🛒 Tarefa 2**: Criar uma aplicação Web para o setor de vendas, com funcionalidades completas de pedidos, status e relatórios.

---

## 🔡 Tarefa 1 - API RESTful

### ✅ Regras:
A API recebe uma string e retorna a **primeira vogal** que:
1. Está **após uma consoante**;
2. Essa consoante tem como **anterior uma vogal**;
3. A vogal encontrada **não se repete** na string.

### 📌 Exemplo:
**Entrada:**
```json
{ "string": "aAbBABacafe" }
```

**Saída:**
```json
{
  "string": "aAbBABacafe",
  "vogal": "e",
  "tempoTotal": "10ms"
}
```

---

## 🛒 Tarefa 2 - Aplicação Web de Vendas

### ✨ Funcionalidades:

- Cadastro e gerenciamento de pedidos (produto, quantidade, valor).
- Controle de status: **Em andamento**, **Finalizado**, **Cancelado**.
- Visualização em **Kanban** e **Dashboard**.
- Geração de relatórios com:
  - ✅ Resumo de Vendas.
  - ✅ Pedidos Pendentes.
  - ✅ Clientes Mais Ativos.

---

## 🚀 Como Executar Localmente

### Pré-requisitos:
- Node.js instalado.

### Passos:

```bash
# Clone o repositório
git clone https://github.com/jcustodio125/gestao-vendas-api-webapp.git
cd logap

# Instale as dependências
npm install

# Execute a aplicação
node server.js
```

Acesse: `http://localhost:3000`

---

## 🌐 Deploy

> A aplicação está hospedada em: [🔗 URL de deploy]

---

## 📁 Estrutura do Projeto

```
logap/
│
├── public/                 # Arquivos estáticos (HTML, CSS, JS)
│   ├── index.html          # Página principal
│   ├── dashboard.html      # Relatórios
│   ├── kanban.html         # Visualização por status
│   └── ...
│
├── server.js               # Servidor Express com API e rotas
├── package.json
└── ...
```

---

## 👨‍💻 Autor

Desenvolvido por [**Jeickson Custodio**](https://www.linkedin.com/in/jeickson-junior-626454239).
🔗 [LinkedIn](https://www.linkedin.com/in/jeicksoncustodio) • 💻 [GitHub](https://github.com/jcustodio125) • 📱 [WhatsApp](https://wa.me/5584999517914)


---
