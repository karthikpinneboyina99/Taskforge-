import { Router, Request, Response } from 'express';
import { initDb } from '../db-init.js';

const router = Router();

let initialized = false;

router.get('/', async (_req: Request, res: Response) => {
  if (initialized) {
    res.json({ message: 'Database already initialized' });
    return;
  }
  try {
    await initDb();
    initialized = true;
    res.json({ message: 'Database initialized successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
