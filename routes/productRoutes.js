const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

// ================== UPLOADS (memória → Cloudinary) ==================

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    'Apenas imagens JPG, PNG, GIF e WEBP são permitidas'
                )
            );
        }
    }
});

// ================== PRODUTOS ==================

// Upload de imagem (APENAS upload, sem criar produto)
router.post(
    '/upload',
    upload.single('image'),
    productController.uploadImage
);

// Criar produto via JSON (sem arquivo) - DEVE VIR ANTES DO GET
router.post(
    '/',
    productController.createProductJSON
);

// Criar produto com arquivo
router.post(
    '/with-image',
    upload.single('image'),
    productController.createProduct
);

// Produtos aleatórios
router.get('/random', productController.getRandomProducts);

// Produtos por categoria
router.get('/category/:category', productController.getProductsByCategory);

// Pesquisa
router.get('/search', productController.searchProducts);

// Todos os produtos - DEVE VIR DEPOIS DAS ROTAS ESPECÍFICAS
router.get('/', productController.getAllProducts);

// ================== ADMIN ==================

// Login
router.post(
    '/admin/login',
    productController.adminLogin
);

// Dashboard
router.get(
    '/admin/stats',
    productController.getDashboardStats
);

// Pedidos
router.get(
    '/admin/orders',
    productController.getAllOrders
);

// Produto por ID
router.get('/:id', productController.getProductById);

// Atualizar produto
router.put(
    '/:id',
    upload.single('image'),
    productController.updateProduct
);

// Apagar produto
router.delete(
    '/:id',
    productController.deleteProduct
);

console.log('[v0] productRoutes.js carregado com sucesso');

module.exports = router;