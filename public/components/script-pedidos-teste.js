async function gerarPedidosTeste(quantidade = 100) {
  const nomesClientes = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Helena"];
  const produtosDisponiveis = ["Camiseta", "Calça", "Tênis", "Jaqueta", "Boné", "Meia", "Mochila", "Relógio"];
  const statusOpcoes = ["Em andamento", "Finalizado", "Cancelado"];

  for (let i = 0; i < quantidade; i++) {
    const cliente = nomesClientes[Math.floor(Math.random() * nomesClientes.length)] + " " + (i + 1);
    const produtos = Array.from({ length: Math.ceil(Math.random() * 3) }, () =>
      produtosDisponiveis[Math.floor(Math.random() * produtosDisponiveis.length)]
    );
    const valorTotal = (Math.random() * 500 + 20).toFixed(2);
    const status = statusOpcoes[Math.floor(Math.random() * statusOpcoes.length)];

    await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, produtos, valorTotal, status })
    });
  }

  alert('Pedidos de teste gerados com sucesso!');
  listarPedidos();
}
