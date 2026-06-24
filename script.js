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
        </tr>
    `;
});
}
buscarProdutos();
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