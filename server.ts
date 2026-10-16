import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import healthHandler from './api/health.ts';
import pm25Handler from './api/pm25.ts';
import psiHandler from './api/psi.ts';
import mapHandler from './api/map.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Mount API handlers from /api folder
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/pm25', (req, res) => pm25Handler(req, res));
  app.all('/api/psi', (req, res) => psiHandler(req, res));
  app.all('/api/map', (req, res) => mapHandler(req, res));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Captain Haze server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
