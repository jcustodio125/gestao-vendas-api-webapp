const columnMap = {
  'col-andamento': 'Em andamento',
  'col-finalizado': 'Finalizado',
  'col-cancelado': 'Cancelado'
};

// Permite que a coluna receba drops
function allowDrop(e) {
  e.preventDefault();
}

// Define o ID do card que está sendo arrastado
function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
  e.target.classList.add('dragging');
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

// Ao soltar: atualiza status e reposiciona
async function drop(e) {
  e.preventDefault();
  const pedidoId = e.dataTransfer.getData('text/plain');
  const targetColumn = e.target.closest('.kanban-column').querySelector('.column-cards');
  const novoStatus = columnMap[targetColumn.id];

  if (!novoStatus) return;

  try {
    // Chama API para atualizar o status
    const res = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });

    if (res.ok) {
      // Move o card imediatamente sem recarregar tudo
      const card = document.querySelector(`[data-id="${pedidoId}"]`);
      if (card && card.parentElement !== targetColumn) {
        targetColumn.appendChild(card);
        card.dataset.status = novoStatus;
      }
    } else {
      alert('Erro ao atualizar status no servidor.');
    }
  } catch (err) {
    console.error('Falha ao conectar com a API:', err);
    alert('Erro de conexão. Verifique o servidor.');
  }
}

// Carrega os pedidos da API e monta os cards
function carregarPedidos() {
  fetch('/api/pedidos')
    .then(res => res.json())
    .then(pedidos => {
      // Limpa todas as colunas primeiro
      Object.keys(columnMap).forEach(colId => {
        const col = document.getElementById(colId);
        if (col) col.innerHTML = '';
      });

      // Cria e adiciona cada card
      pedidos.forEach(pedido => {
        const card = criarCard(pedido);
        const statusCol = getStatusColumn(pedido.status);
        const col = document.getElementById(statusCol);

        if (col) {
          col.appendChild(card);
        }
      });
    })
    .catch(err => {
      console.error('Erro ao carregar pedidos:', err);
      document.getElementById('col-andamento').innerHTML = '<p>Erro ao carregar dados.</p>';
    });
}

// Cria o elemento visual do card
function criarCard(pedido) {
  const card = document.createElement('div');
  card.className = 'card-kanban';
  card.draggable = true;
  card.dataset.id = pedido.id;
  card.dataset.status = pedido.status;

  card.innerHTML = `
    <strong>${pedido.cliente}</strong>
    <div class="valor">R$${pedido.valorTotal.toFixed(2)}</div>
    <small>${pedido.produtos.length} produto(s)</small>
  `;

  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);

  return card;
}

// Mapeia status para ID da coluna
function getStatusColumn(status) {
  return status === 'Em andamento' ? 'col-andamento' :
         status === 'Finalizado' ? 'col-finalizado' :
         'col-cancelado';
}

// Inicializa ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPedidos);