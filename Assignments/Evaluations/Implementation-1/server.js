const express = require('express');
const cors = require('cors');
require('dotenv').config();

const generatePostRoute = require('./routes/generatePost');
const summarizeText = require('./controllers/summarizer');

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.post('/summarize', async (req, res) => {
  const { text } = req.body;
  const summary = await summarizeText(text);
  res.json(summary);
});
server.use('/generate-post', generatePostRoute);

server.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server is running on http://localhost:${process.env.PORT || 8080}`);
  }
});

