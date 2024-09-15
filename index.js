const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

let lastUploadedImage = null;  // Variável para armazenar o caminho da última imagem

// Configuração da pasta de armazenamento das imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Nome único para cada arquivo
  }
});

const upload = multer({ storage: storage });

// Configurar o EJS para renderizar a página
app.set('view engine', 'ejs');

// Verificar se a pasta 'uploads' existe, se não, cria a pasta
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Rota para enviar a imagem via POST
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }
  
  // Atualizar a variável com o caminho da última imagem
  lastUploadedImage = `/uploads/${req.file.filename}`;
  
  // Redirecionar para a página principal, que agora mostrará a última imagem
  res.redirect('/');
});

// Servir os arquivos estáticos (imagens)
app.use('/uploads', express.static('uploads'));

// Rota inicial
app.get('/', (req, res) => {
  res.render('showImage', { imagePath: lastUploadedImage });
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
