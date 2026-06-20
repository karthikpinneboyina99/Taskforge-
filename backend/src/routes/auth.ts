import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { createToken } from '../auth.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    const allowedRole = role === 'employee' ? 'employee' : 'external';
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email, hashed, name, allowedRole]
    );
    const user = result.rows[0];
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await query(
      'SELECT id, email, password, name, role FROM users WHERE email = $1 AND role IN ($2, $3)',
      [email, 'employee', 'external']
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = await createToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await query(
      'SELECT id, email, password, name, role FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid admin credentials' });
      return;
    }

    const token = await createToken({ userId: user.id, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { verifyToken } = await import('../auth.js');
  const payload = await verifyToken(auth.slice(7));
  if (!payload) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const result = await query('SELECT id, email, name, role, created_at FROM users WHERE id = $1', [payload.userId]);
  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user: result.rows[0] });
});

export default router;
