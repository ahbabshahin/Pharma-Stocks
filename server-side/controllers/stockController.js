const Stock = require('../models/Stock');
const CustomError = require('../errors');

// Create a new product
const createProduct = async (req, res) => {
	const { productName, productQuantity, productPrice, productDosage } =
		req.body;

	try {
		const newProduct = new Stock({
			productName,
			productQuantity,
			productPrice,
			productDosage,
		});

		await newProduct.save();
		res.status(201).json({
			message: 'Product created successfully',
			product: newProduct,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Get all products with pagination
const getAllProducts = async (req, res) => {
	const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

	try {
		const skip = (page - 1) * limit; // Calculate how many records to skip
		const totalProducts = await Stock.countDocuments(); // Get total number of products
		const products = await Stock.find()
			.skip(skip)
			.limit(limit)
			.sort({ createdAt: -1 }); // Sort by creation date, descending

		res.status(200).json({
			totalProducts,
			totalPages: Math.ceil(totalProducts / limit),
			currentPage: Number(page),
			products,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Get product by ID
const getProductById = async (req, res) => {
	const { productId } = req.params;

	try {
		const product = await Stock.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ product });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Update product stock (e.g., after a sale or return)
const updateProductStock = async (req, res) => {
	const { productId } = req.params;
	const { soldQuantity, returnedQuantity } = req.body;

	try {
		const product = await Stock.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		if (soldQuantity) {
			product.productQuantity -= soldQuantity;
		}

		if (returnedQuantity) {
			product.productQuantity += returnedQuantity;
		}

		// Ensure stock does not fall below zero
		if (product.productQuantity < 0) {
			product.productQuantity = 0;
		}

		await product.save();
		res.status(200).json({
			message: 'Stock updated successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Delete a product
const deleteProduct = async (req, res) => {
	const { productId } = req.params;

	try {
		const product = await Stock.findByIdAndDelete(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.status(200).json({ message: 'Product deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Update stock for a specific store (Admin only)
const updateStockForStore = async (req, res) => {
	const { productId, storeId } = req.params;
	const { stockLevel, lowStockThreshold } = req.body;

	try {
		const product = await Stock.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		const store = product.stores.id(storeId);
		if (!store) {
			return res.status(404).json({ message: 'Store not found' });
		}

		store.stockLevel = stockLevel || store.stockLevel;
		store.lowStockThreshold = lowStockThreshold || store.lowStockThreshold;

		await product.save();
		res.status(200).json({
			message: 'Store stock updated successfully',
			product,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

const searchStock = async (req, res) => {
	const { query, quantity, price, brand } = req.query; // Get the search query and additional filters from query parameters

	// Build the search criteria
	const searchCriteria = {
		$or: [],
	};

	if (query) {
		searchCriteria.$or.push(
			{ productName: { $regex: query, $options: 'i' } },
			{ productDosage: { $regex: query, $options: 'i' } },
			{ brand: { $regex: query, $options: 'i' } }
		);
	}

	if (quantity) {
		searchCriteria.productQuantity = quantity; // Filter by quantity
	}

	if (price) {
		searchCriteria.productPrice = price; // Filter by price
	}

	try {
		const products = await Stock.find(searchCriteria);

		if (products.length === 0) {
			return res.status(404).json({ message: 'No products found' });
		}

		res.status(200).json({ products });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

module.exports = {
	createProduct,
	getAllProducts,
	getProductById,
	updateProductStock,
	deleteProduct,
	updateStockForStore,
	searchStock,
};
