const express = require('express');
const router = express.Router();

const generatePostWithGemini = require('../controllers/generatePostWithGemini');

// Allowed platforms
const allowedPlatforms = ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'];

// POST /generate-post
router.post('/', async (req, res) => {
  const { platform, topic } = req.body;

  // Input Validation
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'Topic is required and must be a string.' });
  }

  if (!platform || !allowedPlatforms.includes(platform)) {
    return res.status(400).json({ error: `Platform must be one of: ${allowedPlatforms.join(', ')}` });
  }

  try {
    const post = await generatePostWithGemini(platform, topic);

    return res.json({
      platform,
      post
    });
  } catch (err) {
    console.error('Error generating post:', err);
    return res.status(500).json({ error: 'Failed to generate post.' });
  }
});

module.exports = router;
