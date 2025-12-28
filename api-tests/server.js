import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// "Database" in memory
let usuarios = [
  { id: 1, nome: 'Admin Master', email: 'admin@biblioteca.com', senha: '123456', tipo: 3 },
  { id: 2, nome: 'João Funcionário', email: 'func@biblio.com', senha: '123456', tipo: 2 },
  { id: 3, nome: 'Maria Aluna', email: 'aluna@teste.com', senha: '123456', tipo: 1 }
];

let livros = [
  {
    id: 1, nome: 'Clean Code', autor: 'Robert C. Martin', paginas: 464,
    descricao: 'Um guia completo sobre boas práticas de programação',
    imagemUrl: 'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
    dataCadastro: new Date().toISOString(), estoque: 5, preco: 49.90
  },
  {
    id: 2, nome: 'Harry Potter', autor: 'J.K. Rowling', paginas: 309,
    descricao: 'O primeiro livro da saga do bruxinho mais famoso',
    imagemUrl: 'https://m.media-amazon.com/images/I/81ibfYk4qmL._SY466_.jpg',
    dataCadastro: new Date().toISOString(), estoque: 3, preco: 39.90
  }
];

let favoritos = [];
let arrendamentos = [];
let compras = [];

let proximoIdUsuario = 4;
let proximoIdLivro = 3;
let proximoIdArrendamento = 1;
let proximoIdCompra = 1;

// Routes
app.post('/registro', (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) return res.status(400).json({ mensagem: 'Email já cadastrado' });

  const novoUsuario = { id: proximoIdUsuario++, nome, email, senha, tipo: parseInt(tipo) || 1 };
  usuarios.push(novoUsuario);
  const { senha: _, ...usuarioSemSenha } = novoUsuario;
  res.status(201).json({ mensagem: 'Usuário criado com sucesso', usuario: usuarioSemSenha });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (!usuario) return res.status(401).json({ mensagem: 'Email ou senha incorretos' });
  const { senha: _, ...usuarioSemSenha } = usuario;
  res.json({ mensagem: 'Login realizado com sucesso', usuario: usuarioSemSenha });
});

app.get('/livros', (req, res) => res.json(livros));

app.get('/estatisticas', (req, res) => {
  res.json({
    totalLivros: livros.length,
    totalUsuarios: usuarios.length,
    livrosDisponiveis: livros.filter(l => l.estoque > 0).length
  });
});

app.post('/arrendamentos', (req, res) => {
  const { usuarioId, livroId, dataInicio, dataFim } = req.body;
  const livro = livros.find(l => l.id === parseInt(livroId));
  if (!livro) return res.status(404).json({ mensagem: 'Livro não encontrado' });

  const novoArrendamento = {
    id: proximoIdArrendamento++,
    usuarioId: parseInt(usuarioId),
    livroId: livro.id,
    dataInicio,
    dataFim,
    status: 'PENDENTE',
    criadoEm: new Date().toISOString()
  };
  arrendamentos.push(novoArrendamento);
  res.status(201).json(novoArrendamento);
});

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Biblioteca', version: '3.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: [path.join(__dirname, './server.js')]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `SERVER START SUCCESS!`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});

export default app;