const router = require('express').Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API test route' });
});

module.exports = router;