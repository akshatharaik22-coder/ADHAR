const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const VerifyToken = require('../middleware/VerifyToken');

// Get all candidates
router.get('/candidates', async (req, res) => {
  try {
    const [candidates] = await db.query('SELECT id, name, party FROM candidates');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cast vote (protected)
router.post('/cast', verifyToken, async (req, res) => {
  const { candidateId } = req.body;
  const aadhaar = req.voter.aadhaar;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [voter] = await conn.query(
      'SELECT has_voted FROM voters WHERE aadhaar_number = ?', [aadhaar]
    );

    if (voter[0].has_voted) {
      await conn.rollback();
      return res.status(403).json({ message: 'You have already voted' });
    }

    await conn.query(
      'UPDATE candidates SET vote_count = vote_count + 1 WHERE id = ?', [candidateId]
    );

    await conn.query(
      'UPDATE voters SET has_voted = 1 WHERE aadhaar_number = ?', [aadhaar]
    );

    await conn.query(
      'INSERT INTO votes (aadhaar_number, candidate_id) VALUES (?, ?)', [aadhaar, candidateId]
    );

    await conn.commit();
    res.json({ message: 'Vote cast successfully!' });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Voting failed. Try again.' });
  } finally {
    conn.release();
  }
});

// Get results
router.get('/results', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT name, party, vote_count FROM candidates ORDER BY vote_count DESC'
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;