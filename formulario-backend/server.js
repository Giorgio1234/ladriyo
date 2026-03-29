const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'submissions.jsonl');

// Only accept requests from the production domain (and localhost for testing)
const ALLOWED_ORIGINS = [
  'https://soyladriyo.com',
  'https://www.soyladriyo.com',
  'http://localhost',
  'http://127.0.0.1',
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, Postman) only in dev
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'OPTIONS'],
}));

app.use(express.json({ limit: '64kb' }));

// Ensure data directory exists
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

app.post('/api/survey', (req, res) => {
  const body = req.body;

  if (!body || !body.nombre || !body.edad) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' });
  }

  const forwardedIps = req.headers['x-forwarded-for'];
  const entry = {
    ts: new Date().toISOString(),
    ip: forwardedIps ? forwardedIps.split(',')[0].trim() : req.socket.remoteAddress,
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
