import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname, '../Frontend')));

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend', 'index.html'));
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
