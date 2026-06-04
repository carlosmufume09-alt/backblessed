const express = require('express');
const router = express.Router();

// Placeholder para rotas de pedidos
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Orders endpoint' });
});

router.post('/', (req, res) => {
  res.json({ success: true, message: 'Create order endpoint' });
});

module.exports = router;
