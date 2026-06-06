const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
    'https://castilho-ten.vercel.app',
    'https://www.castilho-ten.vercel.app',
    'https://castilho-carlos-roberto-robertos-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

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
