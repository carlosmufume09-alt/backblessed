const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const storeRoutes = require('./routes/storeRoutes');

const app = express();

console.log('🚀 API inicializando...');

// ================= MIDDLEWARES =================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://teu-front.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
// garante que uploads funcionam sempre
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/store', storeRoutes);

// ================= HEALTH CHECK =================
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Shells Fashion Elegance API',
    version: '1.0.0',
    location: 'Khongolote, Maputo, Moçambique',
    currency: 'Meticais (MT)'
  });
});

// ================= 404 HANDLER (IMPORTANTE) =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('🔥 Erro:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
});

module.exports = app;
