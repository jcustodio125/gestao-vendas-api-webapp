const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Banco de dados em memória
let pedidos = [];
let idCounter = 1;

// === TAREFA 1: Rota da API para encontrar a vogal ===
app.post('/api/encontrar-vogal', (req, res) => {
  const { string } = req.body;
  if (!string || typeof string !== 'string') {
    return res.status(400).json({ error: 'Envie uma string válida.' });
  }

  const start = Date.now();

  const vogais = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
  const consoantes = new Set(
    'bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ'.split('')
  );

  // Contar ocorrências
  const contagem = {};
  for (let char of string) {
    contagem[char] = (contagem[char] || 0) + 1;
  }

  let anterior = null;
  let anteriorAnterior = null;
  let resultado = null;

  for (let i = 0; i < string.length; i++) {
    const atual = string[i];
    const ehVogalAtual = vogais.has(atual);
    const ehConsoanteAnterior = consoantes.has(anterior);
    const ehVogalAnteriorAnterior = vogais.has(anteriorAnterior);

    // Condição: atual é vogal, anterior é consoante, e anterirorAnterior é vogal
    if (ehVogalAtual && ehConsoanteAnterior && ehVogalAnteriorAnterior) {
      if (contagem[atual] === 1) {
        resultado = atual;
        break;
      }
    }

    anteriorAnterior = anterior;
    anterior = atual;
  }

  const tempoTotal = `${Date.now() - start}ms`;

  res.json({
    string,
    vogal: resultado || null,
    tempoTotal
  });
});

// === TAREFA 2: Rotas para Pedidos ===

// Criar pedido
app.post('/api/pedidos', (req, res) => {
  const { cliente, produtos, valorTotal, status = "Em andamento" } = req.body;
  const novoPedido = {
    id: idCounter++,
    cliente,
    produtos,
    valorTotal: Number(valorTotal),
    status,
    data: new Date().toLocaleDateString()
  };
  pedidos.push(novoPedido);
  res.json(novoPedido);
});

// Listar todos
app.get('/api/pedidos', (req, res) => {
  res.json(pedidos);
});

// Atualizar status
app.put('/api/pedidos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado' });
  pedido.status = status;
  res.json(pedido);
});

// Relatórios
app.get('/api/relatorios', (req, res) => {
  const totalPedidos = pedidos.length;
  const valorTotalFaturado = pedidos.reduce((acc, p) => acc + p.valorTotal, 0);
  const quantidadeTotalProdutos = pedidos.reduce((acc, p) => acc + p.produtos.length, 0);

  const pedidosPendentes = pedidos.filter(p => p.status === "Em andamento");

  const clientesAtivos = pedidos.reduce((acc, p) => {
    acc[p.cliente] = (acc[p.cliente] || 0) + 1;
    return acc;
  }, {});

  const clientesMaisAtivos = Object.entries(clientesAtivos)
    .map(([cliente, total]) => ({ cliente, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  res.json({
  resumo: { totalPedidos, valorTotalFaturado, quantidadeTotalProdutos },
  pedidos,
  pedidosPendentes,
  clientesMaisAtivos
});
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});