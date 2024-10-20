const mongoose = require('mongoose');
const stockSchema = new mongoose.Schema({
	productName: {
		type: String,
		required: [true, 'Product name is required'],
	},
	productQuantity: {
		type: Number,
		required: [true, 'Product quantity is required'],
		min: [0, 'Product quantity must be greater than 0'],
	},
	productPrice: {
		type: Number,
		required: [true, 'Product price is required'],
		min: [0, 'Product price must be greater than 0'],
	},
	brand: {
		type: String,
	},
	productDosage: {
		type: String,
	},
	lowStockThreshold: {
		type: Number,
		default: 10, // Customize as needed
	},
	isLowStock: {
		type: Boolean,
		default: false,
	},
});

// Pre-save hook to check for low stock
stockSchema.pre('save', function (next) {
	// Check if the product quantity is below the threshold
	if (this.productQuantity <= this.lowStockThreshold) {
		this.isLowStock = true;
	} else {
		this.isLowStock = false;
	}
	next();
});

module.exports = mongoose.model('Stock', stockSchema);
