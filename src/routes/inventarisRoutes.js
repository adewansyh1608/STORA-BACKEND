const express = require('express');
const router = express.Router();
const inventarisController = require('../controllers/inventarisController');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

// Validation rules for inventaris creation
const inventarisValidationRules = [
  body('Nama_Barang').notEmpty().withMessage('Nama barang is required'),
  body('Kode_Barang').notEmpty().withMessage('Kode barang is required'),
  body('Jumlah')
    .isInt({ min: 0 })
    .withMessage('Jumlah must be a positive integer'),
  body('Kategori').notEmpty().withMessage('Kategori is required'),
  body('Kondisi')
    .isIn(['Baik', 'Rusak Ringan', 'Rusak Berat'])
    .withMessage('Kondisi must be one of: Baik, Rusak Ringan, Rusak Berat'),
];

// Routes
router.get('/', inventarisController.getAllInventaris);
router.get('/stats', authMiddleware, inventarisController.getInventarisStats);
router.get('/:id', inventarisController.getInventarisById);
router.post(
  '/',
  authMiddleware,
  inventarisValidationRules,
  inventarisController.createInventaris
);
router.put('/:id', authMiddleware, inventarisController.updateInventaris);
router.delete('/:id', authMiddleware, inventarisController.deleteInventaris);

module.exports = router;
