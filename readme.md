# VersusCode

VersusCode est un éditeur de code minimaliste inspiré de VSCode, développé en Node.js avec Express, Vue.js et Monaco Editor. Il permet de créer, éditer, organiser et sauvegarder des fichiers et dossiers localement dans le navigateur.

## Fonctionnalités

- **Explorateur de fichiers** : création, renommage, suppression de fichiers et dossiers (arborescence récursive).
- **Éditeur de code** : basé sur Monaco Editor (le même que VSCode), avec coloration syntaxique pour JS, HTML, CSS, Python, Go, Markdown, etc.
- **Import/export** : import de fichiers locaux, sauvegarde locale ou téléchargement, support de l’API File System Access (Chrome/Edge).
- **Notifications toast** : feedback utilisateur pour chaque action.
- **Interface responsive** : design moderne avec Tailwind CSS et icônes Boxicons.

## Installation

1. Clone le dépôt :
   ```sh
   git clone https://github.com/D4shW/versus-code.git
   cd versus-code
   ```

2. Installe les dépendances :
   ```sh
   npm install
   ```

3. Lance l’application :
   ```sh
   node app.js
   ```

4. Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.