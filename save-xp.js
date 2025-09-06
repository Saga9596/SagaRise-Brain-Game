
import { saveUserXP } from '../../js/database.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, xp, level, achievements } = req.body;

    const result = await saveUserXP(userId, { xp, level, achievements });

    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
