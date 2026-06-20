import { query } from './db.js';
import bcrypt from 'bcryptjs';

export async function initDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'external')),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const hashed = await bcrypt.hash('kanban@123', 10);
  await query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO NOTHING;`,
    ['karthikpinneboyina@gmail.com', hashed, 'Admin']
  );

  await query(`DELETE FROM users WHERE email = 'employee@taskforge.io'`);

  console.log('Database initialized with seed data');
}
