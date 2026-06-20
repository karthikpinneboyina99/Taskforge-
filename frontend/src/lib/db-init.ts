import { query } from './db';

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'employee', 'external')),
  created_at TIMESTAMP DEFAULT NOW()
);
`;

const seedAdmin = `
INSERT INTO users (email, password, name, role)
VALUES ($1, $2, $3, 'admin')
ON CONFLICT (email) DO NOTHING;
`;

export async function initDb() {
  await query(createUsersTable);

  const bcrypt = await import('bcryptjs');
  const hashed = await bcrypt.hash('admin123', 10);
  await query(seedAdmin, ['admin@taskforge.io', hashed, 'Admin']);

  const hashedEmp = await bcrypt.hash('emp123', 10);
  await query(
    `INSERT INTO users (email, password, name, role)
     VALUES ($1, $2, $3, 'employee')
     ON CONFLICT (email) DO NOTHING;`,
    ['employee@taskforge.io', hashedEmp, 'Employee']
  );
}
