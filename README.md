# Sistema ERP com Flask

Um sistema ERP (Enterprise Resource Planning) completo desenvolvido com Flask e SQLite3, oferecendo uma interface moderna e responsiva para gestão empresarial.

## 🚀 Características

- **Interface Responsiva**: Design moderno com Bootstrap 5 e Font Awesome
- **Barra Lateral Sanduíche**: Menu lateral responsivo com JavaScript
- **Banco de Dados SQLite3**: Leve e eficiente para desenvolvimento
- **CRUD Completo**: Operações completas para todas as entidades
- **Validações**: Formulários com validações de CPF, CNPJ e outros campos
- **Dashboard**: Painel com estatísticas e atalhos rápidos

## 📋 Funcionalidades

### Cadastros
- **Empresas**: Razão social, CNPJ, endereço, contatos
- **Pessoas**: Clientes, fornecedores e funcionários
- **Usuários**: Sistema de usuários com níveis de acesso
- **Mercadorias**: Produtos com preços e controle de estoque

### Controle de Estoque
- **Movimentações**: Entrada, saída e ajustes
- **Saldos**: Controle de quantidades e valores
- **Histórico**: Rastreamento completo das movimentações

## 🛠️ Tecnologias Utilizadas

- **Backend**: Flask 2.3.3
- **Banco de Dados**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Framework CSS**: Bootstrap 5.3.0
- **Ícones**: Font Awesome 6.4.0
- **Responsividade**: Mobile-first design

## 📁 Estrutura do Projeto

```
├── app.py                      # Aplicação principal Flask
├── requirements.txt            # Dependências Python
├── erp_system.db              # Banco de dados SQLite3
├── static/
│   ├── css/
│   │   └── style.css          # Estilos customizados
│   └── js/
│       └── sidebar.js         # JavaScript da barra lateral
└── templates/
    ├── base.html              # Template base
    ├── index.html             # Página inicial
    ├── dashboard.html         # Dashboard principal
    ├── empresas/              # Templates de empresas
    ├── pessoas/               # Templates de pessoas
    ├── usuarios/              # Templates de usuários
    ├── mercadorias/           # Templates de mercadorias
    └── saldos/                # Templates de estoque
```

## 🚀 Como Executar

### Pré-requisitos
- Python 3.7+
- pip

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/lucasdev183-cell/erp.git
cd erp
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Execute a aplicação:
```bash
python app.py
```

4. Acesse no navegador:
```
http://localhost:5000
```

## 📊 Banco de Dados

O sistema utiliza SQLite3 com as seguintes tabelas:

- **empresas**: Dados das empresas
- **pessoas**: Clientes, fornecedores e funcionários
- **usuarios**: Usuários do sistema
- **mercadorias**: Produtos e serviços
- **saldos**: Movimentações de estoque

## 🎨 Interface

### Barra Lateral
- Menu sanduíche responsivo
- Atalhos rápidos para cadastros
- Navegação intuitiva entre módulos
- Adaptável para desktop e mobile

### Dashboard
- Estatísticas em tempo real
- Cards informativos
- Ações rápidas
- Interface clean e moderna

### Formulários
- Validações em tempo real
- Máscaras para CPF, CNPJ, telefone
- Feedback visual para usuário
- Design responsivo

## 🔧 Funcionalidades Técnicas

### Validações JavaScript
- CPF e CNPJ com algoritmo de validação
- Máscaras automáticas para campos
- Validação de formulários em tempo real

### Responsividade
- Design mobile-first
- Barra lateral adaptativa
- Tabelas responsivas
- Cards flexíveis

### Segurança
- Validações server-side
- Sanitização de dados
- Proteção contra SQL injection (SQLite3 com parâmetros)

## 📈 Próximas Funcionalidades

- [ ] Sistema de autenticação
- [ ] Relatórios em PDF
- [ ] Gráficos e dashboard avançado
- [ ] API REST
- [ ] Backup automático
- [ ] Multi-empresa
- [ ] Integração com APIs externas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Lucas Dev**
- GitHub: [@lucasdev183-cell](https://github.com/lucasdev183-cell)

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação
2. Procure nas issues existentes
3. Crie uma nova issue se necessário

---

**Sistema ERP - Gestão Empresarial Simplificada** 🏢✨