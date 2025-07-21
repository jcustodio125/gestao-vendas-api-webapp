let paginaAtual = 1;
const pedidosPorPagina = 10;

async function encontrarVogal() {
  const string = document.getElementById('inputString').value;
  const res = await fetch('/api/encontrar-vogal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ string })
  });
  const data = await res.json();
  document.getElementById('resultadoApi').textContent = JSON.stringify(data, null, 2);
}

async function cadastrarPedido(e) {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const produtos = document.getElementById('produtos').value.split(',').map(p => p.trim());
  const valorTotal = parseFloat(document.getElementById('valorTotal').value);
  const status = document.getElementById('status').value;

  await fetch('/api/pedidos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, produtos, valorTotal, status })
  });

  document.getElementById('cliente').value = '';
  document.getElementById('produtos').value = '';
  document.getElementById('valorTotal').value = '';
  listarPedidos(paginaAtual);
}

async function listarPedidos(pagina = 1) {
  const res = await fetch('/api/pedidos');
  const dados = await res.json();
  const lista = document.getElementById('listaPedidos');
  if (!lista) return;

  // Obter filtros
  const filtroCliente = document.getElementById('filtroCliente')?.value?.toLowerCase() || '';
  const filtroStatus = document.getElementById('filtroStatus')?.value || '';

  // Aplicar filtros
  const pedidosFiltrados = dados.filter(pedido => {
    const clienteMatch = pedido.cliente.toLowerCase().includes(filtroCliente);
    const statusMatch = !filtroStatus || pedido.status === filtroStatus;
    return clienteMatch && statusMatch;
  });

  if (pedidosFiltrados.length === 0) {
    lista.innerHTML = `<p class="text-muted">Nenhum pedido encontrado com os filtros aplicados.</p>`;
    document.getElementById('paginacao').innerHTML = '';
    return;
  }

  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
  const inicio = (pagina - 1) * pedidosPorPagina;
  const fim = inicio + pedidosPorPagina;
  const pedidosPagina = pedidosFiltrados.slice(inicio, fim);

  let html = `
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead class="table-primary text-center">
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Produtos</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
  `;

  pedidosPagina.forEach((pedido, index) => {
    let badgeClass = "secondary";
    if (pedido.status === "Finalizado") badgeClass = "success";
    else if (pedido.status === "Em andamento") badgeClass = "warning";
    else if (pedido.status === "Cancelado") badgeClass = "danger";

    html += `
      <tr class="text-center">
        <td>${inicio + index + 1}</td>
        <td>${pedido.cliente}</td>
        <td>${pedido.produtos.join(', ')}</td>
        <td>R$ ${parseFloat(pedido.valorTotal).toFixed(2)}</td>
        <td><span class="badge bg-${badgeClass}">${pedido.status}</span></td>
        <td>
          <select class="form-select" onchange="atualizarStatus(${pedido.id}, this.value)">
            <option ${pedido.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
            <option ${pedido.status === 'Finalizado' ? 'selected' : ''}>Finalizado</option>
            <option ${pedido.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
          </select>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  // Paginação
  let paginacaoHTML = '';
  for (let i = 1; i <= totalPaginas; i++) {
    paginacaoHTML += `
      <li class="page-item ${i === pagina ? 'active' : ''}">
        <button class="page-link" onclick="mudarPagina(${i})">${i}</button>
      </li>
    `;
  }

  lista.innerHTML = html;
  document.getElementById('paginacao').innerHTML = paginacaoHTML;
  paginaAtual = pagina;
}

async function atualizarStatus(id, status) {
  await fetch(`/api/pedidos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  listarPedidos(paginaAtual);
}

async function gerarRelatorio() {
  const res = await fetch('/api/relatorios');
  const data = await res.json();
  const div = document.getElementById('relatorio');
  if (!div) return;

  div.innerHTML = `
    <div class="card p-4 shadow-sm">
      <h4 class="mb-3">Resumo de Vendas</h4>
      <ul class="list-group mb-3">
        <li class="list-group-item">Total de pedidos: <strong>${data.resumo.totalPedidos}</strong></li>
        <li class="list-group-item">Valor faturado: <strong>R$ ${data.resumo.valorTotalFaturado.toFixed(2)}</strong></li>
        <li class="list-group-item">Produtos vendidos: <strong>${data.resumo.quantidadeTotalProdutos}</strong></li>
      </ul>

      <h4 class="mt-4 mb-3">Pedidos Pendentes</h4>
      <ul class="list-group mb-3">
        ${data.pedidosPendentes.map(p => `
          <li class="list-group-item">${p.cliente} - R$ ${p.valorTotal.toFixed(2)} <span class="badge bg-warning text-dark">${p.status}</span></li>
        `).join('')}
      </ul>

      <h4 class="mt-4 mb-3">Clientes Mais Ativos</h4>
      <ol class="list-group list-group-numbered">
        ${data.clientesMaisAtivos.map(c => `
          <li class="list-group-item">${c.cliente} <span class="badge bg-primary">${c.total} pedidos</span></li>
        `).join('')}
      </ol>
    </div>
  `;
}

function mudarPagina(pagina) {
  listarPedidos(pagina);
}


function aplicarFiltros() {
  listarPedidos(1);
}

function limparFiltros() {
  document.getElementById('filtroCliente').value = '';
  document.getElementById('filtroStatus').value = '';
  listarPedidos(1);
}

// Inicialização
listarPedidos();
