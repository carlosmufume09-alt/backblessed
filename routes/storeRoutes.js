const express = require('express');
const router = express.Router();

// Placeholder para rotas da loja
router.get('/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Shells Fashion Elegance',
      location: 'Khongolote, Maputo',
      currency: 'MT'
    }
  });
});

module.exports = router;
