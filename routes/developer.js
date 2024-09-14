const express = require('express');
const pool = require('../config/db'); // Ensure this path is correct
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Endpoint to register a developer and generate UUID token
router.post('/register', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Generate a unique UUID token for the developer
    const apiToken = uuidv4();

    // Insert the developer into the database
    await pool.query(
      `INSERT INTO developers (name, api_token, is_active) 
       VALUES ($1, $2, $3) RETURNING id, api_token`,
      [name, apiToken, true]
    );

    // Return a confirmation message without exposing the id and api_token
    res.status(201).json({
      message: 'Developer registered successfully. Please check your email for further instructions.',
    });
  } catch (error) {
    console.error('Error registering developer:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to retrieve the developer's API token
router.post('/retrieve-token', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    // Retrieve the developer's API token from the database
    const result = await pool.query(
      `SELECT id, api_token FROM developers WHERE name = $1 AND is_active = $2`,
      [name, true]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Developer not found or inactive' });
    }

    // Return the developer's ID and token
    res.status(200).json({
      message: 'Token retrieved successfully',
      developer: result.rows[0],
    });
  } catch (error) {
    console.error('Error retrieving token:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

