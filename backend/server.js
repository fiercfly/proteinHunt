const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const dns       = require('dns');
require('dotenv').config();

// Fix DNS on some cloud hosts
dns.setServers(['8.8.8.8', '1.1.1.1']);

const { startCleanupJob }    = require('./jobs/cleanup');
const { startRedditScraper } = require('./jobs/redditScraper');

const app = express();

// ── Trust proxy (required for correct IP behind Render/Vercel) ──────
app.set('trust proxy', 1);

// ── CORS — allow frontend URL(s) ────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow no-origin requests (mobile apps, curl, same-origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Middleware ────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP can break some clients
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, max: 500,
  standardHeaders: true, legacyHeaders: false,
}));
app.use(express.json({ limit: '10mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/deals', require('./routes/deals'));
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// app.use('/api/webhook', require('./routes/webhook'));

// Manually trigger a Reddit poll (for testing — remove in production if you want)
app.post('/api/admin/poll-reddit', (req, res) => {
  const { startRedditScraper } = require('./jobs/redditScraper');
  res.json({ message: 'Poll triggered — check server logs' });
});

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', ts: new Date().toISOString(), env: process.env.NODE_ENV })
);

// ── 404 / error ────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// ── Connect & start ────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startCleanupJob();
    startRedditScraper();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Backend on port ${port}`));
  })
  .catch(err => {
    console.error('❌ MongoDB failed:', err.message);
    process.exit(1);
  });