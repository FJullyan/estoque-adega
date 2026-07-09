from flask import Flask, jsonify, request
from movimentacoes import movimentacoes_bp
from database import supabase
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/produtos", methods=["GET"])
def listar_produtos():
    responta = supabase.table("produtos").select("*").execute()
    produtos = responta.data
    return jsonify(produtos)

@app.route("/produtos", methods=["POST"])
def cadastrar_produtos():
    dados = request.get_json()
    cadastro_produto = supabase.table("produtos").insert(dados).execute()
    return jsonify(cadastro_produto.data)

@app.route("/produtos/<int:id>", methods=["PUT"])
def atualizar_produtos(id):
    dados = request.get_json()
    atualizar_produto = supabase.table("produtos").update(dados).eq("id", id).execute()
    return jsonify(atualizar_produto.data)

@app.route("/produtos/<int:id>", methods=["DELETE"])
def deletar_produtos(id):
    deletar_produto = supabase.table("produtos").delete().eq("id", id).execute()
    return jsonify(deletar_produto.data) 

app.register_blueprint(movimentacoes_bp)

@app.route("/produtos/buscar", methods=["GET"])
def buscar_produtos():
    nome = request.args.get("nome")
    categoria = request.args.get("categoria")
    
    if nome:
        buscar_produto = supabase.table("produtos").select("*").ilike("nome", f"%{nome}%").execute()
        return jsonify(buscar_produto.data)
    
    elif categoria:
        buscar_produto = supabase.table("produtos").select("*").ilike("categoria", f"%{categoria}%").execute()
        return jsonify(buscar_produto.data)
    else:
        return jsonify("Escolha umm produto ou categoria!")

app.run(host="0.0.0.0", port=5000, debug=False)
