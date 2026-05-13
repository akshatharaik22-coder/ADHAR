// AadhaarVoteGuard/backend/server.js

require('dotenv').config(); // ← MUST BE FIRST LINE

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vote', require('./routes/vote'));

app.get('/', (req, res) => res.send('AadhaarVoteGuard Backend Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));