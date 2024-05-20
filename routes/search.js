import express from "express"
import { db } from "../db.js";

const router = express.Router()

router.get('/', (req, res) => {
    console.log("called")
    const { query } = req.query;
    const queryString = `
      SELECT * FROM users
      WHERE username LIKE ?;
    `;
    const searchQuery = `%${query}%`;
    db.query(queryString, [searchQuery, searchQuery], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      res.json(results);
    });
  });

  export default router