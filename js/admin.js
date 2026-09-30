let produtosCadastrados = JSON.parse(localStorage.getItem("produtosCadastrados")) || [];
let idEditando = null;

function salvarNoStorage() {
  localStorage.setItem("produtosCadastrados", JSON.stringify(produtosCadastrados));
}

function limparFormulario() {
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("imagem").value = "";
  document.getElementById("precoDe").value = "";
  document.getElementById("precoPor").value = "";
  document.getElementById("descontoPix").value = "";
  document.getElementById("outrosMeios").value = "";
  document.getElementById("freteGratis").checked = false;
  document.getElementById("selo").value = "";
  document.getElementById("link").value = "";
  idEditando = null;
}

function gerarProduto() {
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const imagem = document.getElementById("imagem").value.trim();
  const precoDe = document.getElementById("precoDe").value.trim();
  const precoPor = document.getElementById("precoPor").value.trim();
  const descontoPix = document.getElementById("descontoPix").value.trim();
  const outrosMeios = document.getElementById("outrosMeios").value.trim();
  const freteGratis = document.getElementById("freteGratis").checked;
  const selo = document.getElementById("selo").value.trim();
  const link = document.getElementById("link").value.trim();

  if (!nome || !imagem || !precoPor || !link) {
    alert("Preencha pelo menos: nome, imagem, preço 'Por' e link de afiliado.");
    return;
  }

  const produto = {
    id: idEditando !== null ? idEditando : Date.now(),
    nome,
    descricao,
    imagem,
    precoDe,
    precoPor,
    descontoPix: descontoPix ? Number(descontoPix) : null,
    outrosMeios: outrosMeios || null,
    freteGratis,
    selo,
    linkAfiliado: link
  };

  if (idEditando !== null) {
    const index = produtosCadastrados.findIndex(p => p.id === idEditando);
    if (index !== -1) {
      produtosCadastrados[index] = produto;
    }
  } else {
    produtosCadastrados.push(produto);
  }

  salvarNoStorage();
  limparFormulario();
  listarCadastrados();
  gerarCodigoParaProdutosJs();
}

function editarProduto(id) {
  const produto = produtosCadastrados.find(p => p.id === id);
  if (!produto) return;

  document.getElementById("nome").value = produto.nome || "";
  document.getElementById("descricao").value = produto.descricao || "";
  document.getElementById("imagem").value = produto.imagem || "";
  document.getElementById("precoDe").value = produto.precoDe || "";
  document.getElementById("precoPor").value = produto.precoPor || "";
  document.getElementById("descontoPix").value = produto.descontoPix || "";
  document.getElementById("outrosMeios").value = produto.outrosMeios || "";
  document.getElementById("freteGratis").checked = !!produto.freteGratis;
  document.getElementById("selo").value = produto.selo || "";
  document.getElementById("link").value = produto.linkAfiliado || "";

  idEditando = id;
}

function cancelarEdicao() {
  limparFormulario();
}

function excluirProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  produtosCadastrados = produtosCadastrados.filter(p => p.id !== id);
  salvarNoStorage();
  listarCadastrados();
  gerarCodigoParaProdutosJs();
}

function listarCadastrados() {
  const container = document.getElementById("lista-cadastrados");
  container.innerHTML = "";

  if (produtosCadastrados.length === 0) {
    container.innerHTML = "<p>Nenhum produto cadastrado ainda.</p>";
    return;
  }

  produtosCadastrados.forEach(p => {
    const div = document.createElement("div");
    div.className = "item-cadastrado";
    div.innerHTML = `
      <strong>${p.nome}</strong> — ${p.precoPor}
      <button onclick="editarProduto(${p.id})">✏️ Editar</button>
      <button onclick="excluirProduto(${p.id})">🗑️ Excluir</button>
    `;
    container.appendChild(div);
  });
}

function gerarCodigoParaProdutosJs() {
  const codigo = "const produtos = " + JSON.stringify(produtosCadastrados, null, 2) + ";";
  document.getElementById("codigoGerado").value = codigo;
}

function copiarCodigo() {
  const textarea = document.getElementById("codigoGerado");
  textarea.select();
  document.execCommand("copy");
  alert("Código copiado! Cole no arquivo produtos.js");
}

function limparTudo() {
  if (!confirm("Isso vai apagar TODOS os produtos cadastrados nesta sessão. Continuar?")) return;
  produtosCadastrados = [];
  localStorage.removeItem("produtosCadastrados");
  listarCadastrados();
  document.getElementById("codigoGerado").value = "";
  limparFormulario();
}

// Inicialização ao carregar a página
listarCadastrados();
gerarCodigoParaProdutosJs();
