
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function saveUserXP(userId, xpData) {
  try {
    const result = await sql`
      INSERT INTO user_progress (user_id, xp, level, achievements, last_updated)
      VALUES (${userId}, ${xpData.xp}, ${xpData.level}, ${JSON.stringify(xpData.achievements)}, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        xp = ${xpData.xp},
        level = ${xpData.level},
        achievements = ${JSON.stringify(xpData.achievements)},
        last_updated = NOW()
    `;
    return result;
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
}

export async function getUserXP(userId) {
  try {
    const result = await sql`
      SELECT * FROM user_progress WHERE user_id = ${userId}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Database fetch error:', error);
    throw error;
  }
}
