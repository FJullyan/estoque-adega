const API_URL = "http://127.0.0.1:5000";
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
            <td><button class="btn btn-danger btn-sm" onclick="deletarProduto(${produto.id})">Deletar</button></td>
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
    await fetch(API_URL + "/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, categoria, quantidade, custo, valor_venda })
});
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
                <td><button class="btn btn-danger btn-sm" onclick="deletarProduto(${produto.id})">Deletar</button></td>
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


document.getElementById("btnBuscar").addEventListener("click", buscar);