import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import setupRoutes from './routes/setup.js';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/setup', setupRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`TaskForge API running on http://localhost:${PORT}`);
});
