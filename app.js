const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuration de multer
const upload = multer({ dest: 'uploads/' });

// Page d'accueil : formulaire d'upload
app.get('/', (req, res) => {
  res.render('index');
});

// Traitement de l'upload
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  const content = fs.readFileSync(filePath, 'utf8');

  res.render('edit', {
    content: content,
    filePath: filePath
  });
});

// Traitement de la sauvegarde
app.post('/save', (req, res) => {
  const { content, filePath } = req.body;

  fs.writeFileSync(filePath, content, 'utf8');

  res.send('Fichier sauvegardé avec succès ! <a href="/">Retour</a>');
});

app.listen(port, () => {
  console.log(`Mini-VSCode écoute sur http://localhost:${port}`);
});
