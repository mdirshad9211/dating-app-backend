const express = require('express');
const authRoutes = require('./modules/auth/auth.routes');

const app = express();

app.use(express.json());


app.get('/heath', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);

module.exports = app;
