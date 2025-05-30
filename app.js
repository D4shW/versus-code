const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index');
});


app.post('/api/save', (req, res) => {
  const { content, fileName } = req.body;
  
  if (!fileName) {
    return res.status(400).json({ error: 'Nom de fichier manquant' });
  }

  
  const filesDir = path.join(__dirname, 'files');
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
  }

  
  const filePath = path.join(filesDir, fileName);

  try {
    
    fs.writeFileSync(filePath, content);
    res.json({ success: true, message: `Fichier ${fileName} sauvegardé avec succès` });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde :', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier' });
  }
});


app.get('/api/files', (req, res) => {
  const filesDir = path.join(__dirname, 'files');
  
  
  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
    return res.json({ files: [] });
  }

  try {
    const files = fs.readdirSync(filesDir)
      .filter(file => !fs.statSync(path.join(filesDir, file)).isDirectory())
      .map(file => {
        const filePath = path.join(filesDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          id: Buffer.from(file).toString('base64'), 
          name: file,
          lastModified: stats.mtime.toISOString(),
          size: stats.size
        };
      });
    
    res.json({ files });
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
  }
});


app.get('/api/files/:id', (req, res) => {
  try {
    const fileName = Buffer.from(req.params.id, 'base64').toString();
    const filePath = path.join(__dirname, 'files', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier :', error);
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
});


app.delete('/api/files/:id', (req, res) => {
  try {
    const fileName = Buffer.from(req.params.id, 'base64').toString();
    const filePath = path.join(__dirname, 'files', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    fs.unlinkSync(filePath);
    res.json({ success: true, message: `Fichier ${fileName} supprimé avec succès` });
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier :', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
  }
});

app.listen(port, () => {
  console.log(`Versus-Code écoute sur http://localhost:${port}`);
});