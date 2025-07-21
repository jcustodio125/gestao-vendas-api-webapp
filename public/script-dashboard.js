document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/api/relatorios');
    const data = await res.json();

    // Atualizar cards
    document.getElementById('totalPedidos').textContent = data.resumo.totalPedidos;
    document.getElementById('faturamento').textContent =
      'R$ ' + data.resumo.valorTotalFaturado.toFixed(2).replace('.', ',');
    document.getElementById('ativos').textContent =
      data.pedidosPendentes.length;
    document.getElementById('clientesAtivos').textContent =
      data.clientesMaisAtivos.length;

    // Gráfico de Status
    new Chart(document.getElementById('graficoStatus'), {
      type: 'doughnut',
      data: {
        labels: ['Em andamento', 'Finalizado', 'Cancelado'],
        datasets: [{
          label: 'Status dos Pedidos',
          data: [
            data.pedidosPendentes.length,
            data.resumo.totalPedidos - data.pedidosPendentes.length - 
              (data.resumo.totalPedidos - data.pedidos.filter(p => p.status !== 'Em andamento' && p.status !== 'Finalizado').length),
            data.resumo.totalPedidos - data.pedidos.filter(p => p.status === 'Finalizado' || p.status === 'Em andamento').length
          ],
          backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c']
        }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Gráfico de Clientes Mais Ativos
    const topClientes = data.clientesMaisAtivos.slice(0, 5);
    new Chart(document.getElementById('graficoClientes'), {
      type: 'bar',
      data: {
        labels: topClientes.map(c => c.cliente),
        datasets: [{
          label: 'Número de Pedidos',
          data: topClientes.map(c => c.total),
          backgroundColor: '#3498db'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });

  } catch (err) {
    console.error("Erro ao carregar dados:", err);
  }
});