
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id VARCHAR(255) PRIMARY KEY,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        achievements JSONB DEFAULT '[]'::jsonb,
        last_updated TIMESTAMP DEFAULT NOW()
      )
    `;

    res.status(200).json({ message: 'Database setup complete' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
