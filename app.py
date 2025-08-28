from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'sua_chave_secreta_aqui'

# Configuração do banco de dados
DATABASE = 'erp_system.db'

def get_db_connection():
    """Conecta ao banco de dados SQLite"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa o banco de dados com as tabelas necessárias"""
    conn = get_db_connection()
    
    # Tabela de Empresas
    conn.execute('''
        CREATE TABLE IF NOT EXISTS empresas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            razao_social TEXT NOT NULL,
            nome_fantasia TEXT,
            cnpj TEXT UNIQUE,
            inscricao_estadual TEXT,
            endereco TEXT,
            telefone TEXT,
            email TEXT,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de Pessoas
    conn.execute('''
        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            rg TEXT,
            endereco TEXT,
            telefone TEXT,
            email TEXT,
            data_nascimento DATE,
            tipo TEXT DEFAULT 'cliente', -- cliente, fornecedor, funcionario
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de Usuários
    conn.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            nivel_acesso TEXT DEFAULT 'usuario', -- admin, usuario, operador
            ativo BOOLEAN DEFAULT 1,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de Mercadorias
    conn.execute('''
        CREATE TABLE IF NOT EXISTS mercadorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE,
            descricao TEXT NOT NULL,
            categoria TEXT,
            unidade_medida TEXT,
            preco_custo DECIMAL(10,2),
            preco_venda DECIMAL(10,2),
            estoque_minimo INTEGER DEFAULT 0,
            ativo BOOLEAN DEFAULT 1,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabela de Saldos/Estoque
    conn.execute('''
        CREATE TABLE IF NOT EXISTS saldos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mercadoria_id INTEGER,
            quantidade INTEGER DEFAULT 0,
            valor_unitario DECIMAL(10,2),
            data_movimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            tipo_movimento TEXT, -- entrada, saida, ajuste
            observacao TEXT,
            FOREIGN KEY (mercadoria_id) REFERENCES mercadorias (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Rotas principais
@app.route('/')
def index():
    """Página principal do sistema"""
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    """Dashboard com resumo do sistema"""
    conn = get_db_connection()
    
    # Contadores para o dashboard
    total_empresas = conn.execute('SELECT COUNT(*) as total FROM empresas').fetchone()['total']
    total_pessoas = conn.execute('SELECT COUNT(*) as total FROM pessoas').fetchone()['total']
    total_usuarios = conn.execute('SELECT COUNT(*) as total FROM usuarios').fetchone()['total']
    total_mercadorias = conn.execute('SELECT COUNT(*) as total FROM mercadorias').fetchone()['total']
    
    conn.close()
    
    stats = {
        'empresas': total_empresas,
        'pessoas': total_pessoas,
        'usuarios': total_usuarios,
        'mercadorias': total_mercadorias
    }
    
    return render_template('dashboard.html', stats=stats)

# === ROTAS DE EMPRESAS ===
@app.route('/empresas')
def listar_empresas():
    """Lista todas as empresas"""
    conn = get_db_connection()
    empresas = conn.execute('SELECT * FROM empresas ORDER BY razao_social').fetchall()
    conn.close()
    return render_template('empresas/listar.html', empresas=empresas)

@app.route('/empresas/novo')
def nova_empresa():
    """Formulário para nova empresa"""
    return render_template('empresas/form.html')

@app.route('/empresas/salvar', methods=['POST'])
def salvar_empresa():
    """Salva uma nova empresa"""
    razao_social = request.form['razao_social']
    nome_fantasia = request.form['nome_fantasia']
    cnpj = request.form['cnpj']
    inscricao_estadual = request.form['inscricao_estadual']
    endereco = request.form['endereco']
    telefone = request.form['telefone']
    email = request.form['email']
    
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO empresas (razao_social, nome_fantasia, cnpj, inscricao_estadual, endereco, telefone, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (razao_social, nome_fantasia, cnpj, inscricao_estadual, endereco, telefone, email))
        conn.commit()
        flash('Empresa cadastrada com sucesso!', 'success')
    except sqlite3.IntegrityError:
        flash('CNPJ já cadastrado!', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('listar_empresas'))

# === ROTAS DE PESSOAS ===
@app.route('/pessoas')
def listar_pessoas():
    """Lista todas as pessoas"""
    conn = get_db_connection()
    pessoas = conn.execute('SELECT * FROM pessoas ORDER BY nome').fetchall()
    conn.close()
    return render_template('pessoas/listar.html', pessoas=pessoas)

@app.route('/pessoas/novo')
def nova_pessoa():
    """Formulário para nova pessoa"""
    return render_template('pessoas/form.html')

@app.route('/pessoas/salvar', methods=['POST'])
def salvar_pessoa():
    """Salva uma nova pessoa"""
    nome = request.form['nome']
    cpf = request.form['cpf']
    rg = request.form['rg']
    endereco = request.form['endereco']
    telefone = request.form['telefone']
    email = request.form['email']
    data_nascimento = request.form['data_nascimento']
    tipo = request.form['tipo']
    
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO pessoas (nome, cpf, rg, endereco, telefone, email, data_nascimento, tipo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (nome, cpf, rg, endereco, telefone, email, data_nascimento, tipo))
        conn.commit()
        flash('Pessoa cadastrada com sucesso!', 'success')
    except sqlite3.IntegrityError:
        flash('CPF já cadastrado!', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('listar_pessoas'))

# === ROTAS DE USUÁRIOS ===
@app.route('/usuarios')
def listar_usuarios():
    """Lista todos os usuários"""
    conn = get_db_connection()
    usuarios = conn.execute('SELECT id, nome, email, nivel_acesso, ativo, data_cadastro FROM usuarios ORDER BY nome').fetchall()
    conn.close()
    return render_template('usuarios/listar.html', usuarios=usuarios)

@app.route('/usuarios/novo')
def novo_usuario():
    """Formulário para novo usuário"""
    return render_template('usuarios/form.html')

@app.route('/usuarios/salvar', methods=['POST'])
def salvar_usuario():
    """Salva um novo usuário"""
    nome = request.form['nome']
    email = request.form['email']
    senha = request.form['senha']  # Em produção, usar hash da senha
    nivel_acesso = request.form['nivel_acesso']
    
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO usuarios (nome, email, senha, nivel_acesso)
            VALUES (?, ?, ?, ?)
        ''', (nome, email, senha, nivel_acesso))
        conn.commit()
        flash('Usuário cadastrado com sucesso!', 'success')
    except sqlite3.IntegrityError:
        flash('Email já cadastrado!', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('listar_usuarios'))

# === ROTAS DE MERCADORIAS ===
@app.route('/mercadorias')
def listar_mercadorias():
    """Lista todas as mercadorias"""
    conn = get_db_connection()
    mercadorias = conn.execute('SELECT * FROM mercadorias WHERE ativo = 1 ORDER BY descricao').fetchall()
    conn.close()
    return render_template('mercadorias/listar.html', mercadorias=mercadorias)

@app.route('/mercadorias/novo')
def nova_mercadoria():
    """Formulário para nova mercadoria"""
    return render_template('mercadorias/form.html')

@app.route('/mercadorias/salvar', methods=['POST'])
def salvar_mercadoria():
    """Salva uma nova mercadoria"""
    codigo = request.form['codigo']
    descricao = request.form['descricao']
    categoria = request.form['categoria']
    unidade_medida = request.form['unidade_medida']
    preco_custo = request.form['preco_custo']
    preco_venda = request.form['preco_venda']
    estoque_minimo = request.form['estoque_minimo']
    
    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO mercadorias (codigo, descricao, categoria, unidade_medida, preco_custo, preco_venda, estoque_minimo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (codigo, descricao, categoria, unidade_medida, preco_custo, preco_venda, estoque_minimo))
        conn.commit()
        flash('Mercadoria cadastrada com sucesso!', 'success')
    except sqlite3.IntegrityError:
        flash('Código já cadastrado!', 'error')
    finally:
        conn.close()
    
    return redirect(url_for('listar_mercadorias'))

# === ROTAS DE SALDOS/ESTOQUE ===
@app.route('/saldos')
def listar_saldos():
    """Lista movimentações de estoque"""
    conn = get_db_connection()
    saldos = conn.execute('''
        SELECT s.*, m.descricao as mercadoria_descricao 
        FROM saldos s 
        JOIN mercadorias m ON s.mercadoria_id = m.id 
        ORDER BY s.data_movimento DESC
    ''').fetchall()
    conn.close()
    return render_template('saldos/listar.html', saldos=saldos)

@app.route('/saldos/novo')
def novo_saldo():
    """Formulário para movimentação de estoque"""
    conn = get_db_connection()
    mercadorias = conn.execute('SELECT * FROM mercadorias WHERE ativo = 1 ORDER BY descricao').fetchall()
    conn.close()
    return render_template('saldos/form.html', mercadorias=mercadorias)

@app.route('/saldos/salvar', methods=['POST'])
def salvar_saldo():
    """Salva movimentação de estoque"""
    mercadoria_id = request.form['mercadoria_id']
    quantidade = request.form['quantidade']
    valor_unitario = request.form['valor_unitario']
    tipo_movimento = request.form['tipo_movimento']
    observacao = request.form['observacao']
    
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO saldos (mercadoria_id, quantidade, valor_unitario, tipo_movimento, observacao)
        VALUES (?, ?, ?, ?, ?)
    ''', (mercadoria_id, quantidade, valor_unitario, tipo_movimento, observacao))
    conn.commit()
    conn.close()
    
    flash('Movimentação registrada com sucesso!', 'success')
    return redirect(url_for('listar_saldos'))

if __name__ == '__main__':
    # Inicializa o banco de dados
    init_db()
    
    # Executa a aplicação
    app.run(debug=True, host='0.0.0.0', port=5000)