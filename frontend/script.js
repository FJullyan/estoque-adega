const API_URL = "https://estoque-adega.onrender.com";
let produtoEditandoId = null;

async function buscarProdutos() {
    const resposta = await fetch(API_URL + "/produtos");   
    const produtos = await resposta.json()
    const tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = "";
    produtos.forEach(produto => {
    tabela.innerHTML += `
        <tr>
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.custo}</td>
            <td>${produto.valor_venda}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deletarProduto(${produto.id})">Deletar</button>
            <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id}, '${produto.nome}', '${produto.categoria}', ${produto.quantidade}, ${produto.custo}, ${produto.valor_venda})">Editar</button>
            </td>
        </tr>
    `;
});
}
async function cadastrarProduto() {
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const quantidade = document.getElementById("quantidade").value;
    const custo = document.getElementById("custo").value;
    const valor_venda = document.getElementById("valor_venda").value;

    if (produtoEditandoId) {
        await fetch(API_URL + "/produtos/" + produtoEditandoId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, categoria, quantidade, custo, valor_venda })
        });
        produtoEditandoId = null;
    } else {
        await fetch(API_URL + "/produtos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, categoria, quantidade, custo, valor_venda })
        });
    }
    await buscarProdutos();
}

document.getElementById("btnCadastrar").addEventListener("click", cadastrarProduto);
async function buscar() {
    const texto = document.getElementById("campoBusca").value;
    const [porNome, porCategoria] = await Promise.all([
        fetch(API_URL + "/produtos/buscar?nome=" + texto).then(r => r.json()),
        fetch(API_URL + "/produtos/buscar?categoria=" + texto).then(r => r.json())
    ]);

    const ids = new Set();
    const produtos = [...porNome, ...porCategoria].filter(p => {
        if (ids.has(p.id)) return false;
        ids.add(p.id);
        return true;
    });

    const tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = "";
    produtos.forEach(produto => {
        tabela.innerHTML += `
            <tr>
                <td>${produto.nome}</td>
                <td>${produto.categoria}</td>
                <td>${produto.quantidade}</td>
                <td>${produto.custo}</td>
                <td>${produto.valor_venda}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deletarProduto(${produto.id})">Deletar</button>
                <button class="btn btn-warning btn-sm" onclick="editarProduto(${produto.id}, '${produto.nome}', '${produto.categoria}', ${produto.quantidade}, ${produto.custo}, ${produto.valor_venda})">Editar</button>
                </td>
            </tr>
        `;
    });
}

async function deletarProduto(id) {
    await fetch(API_URL + "/produtos/" + id, {
        method: "DELETE"
    });
    await buscar();
}

function editarProduto(id, nome, categoria, quantidade, custo, valor_venda) {
    produtoEditandoId = id;
    document.getElementById("nome").value = nome;
    document.getElementById("categoria").value = categoria;
    document.getElementById("quantidade").value = quantidade;
    document.getElementById("custo").value = custo;
    document.getElementById("valor_venda").value = valor_venda;
}

document.getElementById("btnBuscar").addEventListener("click", buscar);