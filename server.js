
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.tsx': 'text/javascript',
  '.json': 'application/json'
};

const server = createServer((req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = join(__dirname, filePath);

  try {
    const content = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (_error) {
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:5000');
});
