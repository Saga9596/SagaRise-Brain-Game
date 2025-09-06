
import { getUserXP } from '../../js/database.js';

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    const userData = await getUserXP(userId);
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}