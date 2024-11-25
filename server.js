require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const { mongoURI } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use(cors());


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/auth', authRoutes);
app.use('/account', accountRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
