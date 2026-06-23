from database import supabase
from flask import jsonify, request, Blueprint

movimentacoes_bp = Blueprint("movimentacoes", __name__)

@movimentacoes_bp.route("/movimentacoes", methods=["POST"])
def movimentacao_produtos():
    dados = request.get_json()
    produto = supabase.table("produtos").select("*").eq("id", dados["produto_id"]).execute()
    
    if dados["tipo"] not in ["entrada", "saida"]:
        return jsonify({"erro": "Tipo inválido. Use 'entrada' ou 'saida'"}), 400

    if dados["tipo"] == "entrada":
        nova_quantidade = produto.data[0]["quantidade"] + dados["quantidade"]
    
    else:
        if dados["quantidade"] < produto.data[0]["quantidade"]:
            nova_quantidade = produto.data[0]["quantidade"] - dados["quantidade"]
        else:
            return jsonify(f'Quantidade indisponivel em estoque, possuimos apenas {produto.data[0]['quantidade']}')

    supabase.table("movimentacoes").insert(dados).execute()

    quantiade_atual = supabase.table("produtos").update({"quantidade": nova_quantidade}).eq("id", dados["produto_id"]).execute()
    return jsonify(quantiade_atual.data)
