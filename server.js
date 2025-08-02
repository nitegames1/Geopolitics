
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.tsx': 'text/javascript',
  '.json': 'application/json'
};

const baseDir = join(__dirname, 'dist');
const port = Number(process.env.PORT) || 5000;

const server = createServer(async (req, res) => {
  let reqPath = req.url || '/';
  if (reqPath.startsWith('/Geopolitics/')) {
    reqPath = reqPath.replace('/Geopolitics', '');
  }
  const filePath = join(baseDir, reqPath === '/' ? '/index.html' : reqPath);

  try {
    const content = await readFile(filePath);
    const ext = extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
