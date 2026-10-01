const produtosSalvos = JSON.parse(localStorage.getItem("produtosCadastrados"));
const listaFinal = (produtosSalvos && produtosSalvos.length > 0) ? produtosSalvos : produtos;

const container = document.getElementById("lista-produtos");
const filtrosContainer = document.getElementById("filtros");

function renderizarProdutos(lista) {
  if (!container) return;
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Nenhum produto encontrado nesta categoria.</p>";
    return;
  }

 lista.forEach(p => {
    const seloHtml = p.selo ? `<span class="selo">${p.selo}</span>` : "";
    const precoAntigoHtml = p.precoDe ? `<p class="preco-antigo">${p.precoDe}</p>` : "";

    const precoDestaqueHtml = `
      <div class="linha-preco-atual">
        <span class="preco-atual">${p.precoPor}</span>
      </div>`;

    const outrosMeiosHtml = p.outrosMeios ? `<p class="outros-meios">ou R$ ${p.outrosMeios} em outros meios</p>` : "";
    const freteHtml = p.freteGratis ? `<p class="frete-gratis">Frete grátis</p>` : "";


    container.innerHTML += `
      <div class="card">
        ${seloHtml}
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
        <div class="card-body">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          ${precoAntigoHtml}
          ${precoDestaqueHtml}
          ${outrosMeiosHtml}
          ${freteHtml}
          <p class="aviso-preco">*Preço sujeito a alteração pelo anunciante. Confirme o valor antes de concluir a compra.</p>
          <a href="${p.linkAfiliado}" target="_blank" rel="noopener sponsored"
             class="btn-comprar" onclick="registrarClique(${p.id})">
            Quero Comprar 🔥
          </a>
        </div>
      </div>`;
  });
}

function gerarFiltros() {
  if (!filtrosContainer) return;
  const categorias = [...new Set(listaFinal.map(p => p.categoria).filter(Boolean))];

  let botoesHtml = `<button class="ativo" onclick="filtrarCategoria('todos', this)">Todos</button>`;
  categorias.forEach(cat => {
    const nomeExibido = cat.charAt(0).toUpperCase() + cat.slice(1);
    botoesHtml += `<button onclick="filtrarCategoria('${cat}', this)">${nomeExibido}</button>`;
  });

  filtrosContainer.innerHTML = botoesHtml;
}

function filtrarCategoria(categoria, botaoClicado) {
  const filtrados = categoria === 'todos'
    ? listaFinal
    : listaFinal.filter(p => p.categoria === categoria);

  renderizarProdutos(filtrados);

  document.querySelectorAll('.filtros button').forEach(btn => btn.classList.remove('ativo'));
  botaoClicado.classList.add('ativo');
}

function registrarClique(id) {
  console.log("Clique registrado no produto ID:", id);
}
const grid = document.getElementById('lista-produtos');

grid.addEventListener('wheel', function (e) {
  const noTopo = grid.scrollTop === 0;
  const noFundo = grid.scrollHeight - grid.scrollTop <= grid.clientHeight + 1;

  if ((noTopo && e.deltaY < 0) || (noFundo && e.deltaY > 0)) {
    e.preventDefault();
    window.scrollBy(0, e.deltaY);
  }
}, { passive: false });


gerarFiltros();
renderizarProdutos(listaFinal);
