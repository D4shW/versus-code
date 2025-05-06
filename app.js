const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Page d'accueil : application Vue
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Mini-VSCode écoute sur http://localhost:${port}`);
});