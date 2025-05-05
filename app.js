const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Pour les requêtes API en JSON
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuration de multer
const upload = multer({ dest: 'uploads/' });

// Page d'accueil : application Vue
app.get('/', (req, res) => {
  res.render('index');
});

// API pour lister les fichiers dans le dossier uploads
app.get('/api/files', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la lecture du dossier' });
    }
    
    // Récupérer des informations sur chaque fichier
    const fileInfoPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        fs.stat(path.join(uploadDir, file), (err, stats) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({
            name: file,
            size: stats.size,
            created: stats.birthtime
          });
        });
      });
    });
    
    Promise.all(fileInfoPromises)
      .then(fileInfos => {
        res.json({ files: fileInfos });
      })
      .catch(err => {
        res.status(500).json({ error: 'Erreur lors de la récupération des informations sur les fichiers' });
      });
  });
});

// API pour obtenir le contenu d'un fichier
app.get('/api/files/:id', (req, res) => {
  const fileId = req.params.id;
  const filePath = path.join(__dirname, 'uploads', fileId);
  
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      return res.status(404).json({ error: 'Fichier non trouvé' });
    }
    
    res.json({ content });
  });
});

// Traitement de l'upload via API
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  
  const filePath = req.file.path;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({
      success: true,
      fileId: path.basename(filePath),
      content: content
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la lecture du fichier' });
  }
});

// Traitement de la sauvegarde via API
app.post('/api/save', (req, res) => {
  const { content, fileId } = req.body;

  if (!fileId || content === undefined) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  const filePath = path.join(__dirname, 'uploads', fileId);

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ success: true, message: 'Fichier sauvegardé avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier' });
  }
});

// API pour créer un nouveau fichier
app.post('/api/create', (req, res) => {
  const { fileName, content } = req.body;
  
  if (!fileName) {
    return res.status(400).json({ error: 'Nom de fichier manquant' });
  }
  
  // Générer un ID unique pour le fichier
  const fileId = Date.now() + '-' + fileName;
  const filePath = path.join(__dirname, 'uploads', fileId);
  
  try {
    // Vérifier si le dossier uploads existe, sinon le créer
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    
    // Écrire le contenu initial (vide par défaut)
    fs.writeFileSync(filePath, content || '', 'utf8');
    
    res.json({
      success: true,
      message: `Fichier ${fileName} créé avec succès`,
      fileId: fileId
    });
  } catch (err) {
    console.error('Erreur lors de la création du fichier:', err);
    res.status(500).json({ error: 'Erreur lors de la création du fichier' });
  }
});

app.listen(port, () => {
  console.log(`Mini-VSCode écoute sur http://localhost:${port}`);
});