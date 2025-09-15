const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/db'); // Caminho correto para o db.js

const app = express();

// Configurações gerais do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Essencial para receber JSON via fetch
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Configuração da sessão
app.use(session({
  secret: 'segredo_super_secreto',
  resave: false,
  saveUninitialized: false
}));

// Importação das rotas
const cadastroRoutes = require('./src/routes/cadastroRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const agendamentosRoutes = require('./src/routes/agendamentosRoutes');

// Uso das rotas
app.use('/cadastro', cadastroRoutes);
app.use('/', loginRoutes);
app.use('/agendamentos', agendamentosRoutes);

// Middleware para proteger páginas restritas
function protegerRota(req, res, next) {
  if (req.session.usuario) {
    return next();
  } else {
    return res.redirect('/login');
  }
}

// Rota dashboard protegida - carrega serviços do banco e renderiza view
app.get('/', protegerRota, async (req, res) => {
  try {
    const [servicos] = await db.query('SELECT id, nome FROM servicos ORDER BY nome ASC');
    res.render('dashboard', { usuario: req.session.usuario, servicos });
  } catch (error) {
    console.error('Erro ao carregar serviços:', error);
    res.render('dashboard', { usuario: req.session.usuario, servicos: [] });
  }
});

// Rota logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Inicializa servidor na porta 3000
app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
