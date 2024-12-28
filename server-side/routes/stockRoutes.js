const express = require('express');
const {
	createProduct,
	getAllProducts,
	getProductById,
	updateProductStock,
	deleteProduct,
	updateStockForStore,
	searchStock, // Import the search function
} = require('../controllers/stockController');
const {
	authenticateUser,
	authorizePermissions,
} = require('../middleware/authentication');

const router = express.Router();

router.post(
	'/',
	authenticateUser,
	// authorizePermissions('admin'),
	createProduct
);
router.get('/', authenticateUser, getAllProducts);
router.get('/search', authenticateUser, searchStock); // Add search route
router.get('/:productId', authenticateUser, getProductById);
router.patch('/:productId', authenticateUser, updateProductStock);
router.delete(
	'/:productId',
	authenticateUser,
	authorizePermissions('admin'),
	deleteProduct
);
router.patch(
	'/:productId/stores/:storeId',
	authenticateUser,
	authorizePermissions('admin'),
	updateStockForStore
);

module.exports = router;
