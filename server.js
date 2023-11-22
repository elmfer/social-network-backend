const express = require('express');
const dbConnection = require('./config/connection');
const routes = require('./controllers');

const PORT = process.env.PORT || 3001;

const app = express();

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

// 404 error handler
app.use((req, res) => {
  res.status(404).send('<h1>404 Error</h1>');
});

// Initialize connection to database and server
dbConnection.once('open', () => {
  console.log('Connected to database');

  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
});