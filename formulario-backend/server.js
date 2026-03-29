const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.jsonl');

// 1. Confiamos en Nginx para obtener la IP real del usuario
app.set('trust proxy', 1);

// 2. Agrega cabeceras de seguridad HTTP
app.use(helmet());

// 3. Restringimos CORS solo a tu dominio
const ALLOWED_ORIGINS = [
  'https://soyladriyo.com',
  'https://www.soyladriyo.com'
];
app.use(cors({
  origin: (origin, cb) => {
    // Permitimos peticiones desde nuestro dominio (o sin origen, como cURL local)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Bloqueado por CORS - Origen no autorizado'));
  }
}));

// 4. Rate Limiting: Máximo 5 peticiones cada 15 minutos por IP
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { ok: false, error: 'Demasiadas peticiones. Por favor intentá de nuevo más tarde.' }
});

app.use(express.json({ limit: '64kb' }));

// Ensure data directory exists
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

// Aplicamos el limitador de spam solo a esta ruta
app.post('/api/survey', formLimiter, (req, res) => {
  const body = req.body;

  if (!body || !body.nombre || !body.edad) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const entry = {
    ts: new Date().toISOString(),
    ip: req.ip, // Ahora es 100% seguro gracias al "trust proxy" de arriba
    ...body,
  };

  // Append as a newline-delimited JSON record
  fs.appendFile(DATA_FILE, JSON.stringify(entry) + '\n', (err) => {
    if (err) {
      console.error('Failed to write submission:', err);
      return res.status(500).json({ ok: false, error: 'Storage error' });
    }
    res.json({ ok: true });
  });
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`ladriyo-forms listening on port ${PORT}`);
});
