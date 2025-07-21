
function loadNavbar() {
  const currentPage = window.location.pathname.split('/').pop();

  const links = [
    { href: 'index.html', text: 'Pedidos', icon: 'bi-card-checklist' },
    { href: 'kanban.html', text: 'Kanban', icon: 'bi-columns-gap' },
    { href: 'dashboard.html', text: 'Dashboard', icon: 'bi-bar-chart-line' }
  ];

  const menuHTML = links.map(link => {
    const isActive = currentPage === link.href;
    return `
      <li class="nav-item">
        <a class="nav-link d-flex align-items-center gap-2 ${isActive ? 'active fw-bold text-white' : 'text-light'}" href="${link.href}">
          <i class="bi ${link.icon}"></i> ${link.text}
        </a>
      </li>`;
  }).join('');

  const navbarHTML = `
    <nav class="navbar navbar-expand-lg" style="background-color: #0a2647;">
      <div class="container-fluid">
        <a class="navbar-brand text-white fw-semibold d-flex align-items-center gap-2" href="#">
          <i class="bi bi-shop-window fs-4"></i> Sistema de Vendas
        </a>
        <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            ${menuHTML}
          </ul>
        </div>
      </div>
    </nav>
  `;

  const navbarContainer = document.getElementById('navbar');
  if (navbarContainer) {
    navbarContainer.innerHTML = navbarHTML;
    console.log('✅ Navbar carregada!');
  } else {
    console.error('❌ ERRO: Elemento com id="navbar" não encontrado.');
  }
}

document.addEventListener('DOMContentLoaded', loadNavbar);
