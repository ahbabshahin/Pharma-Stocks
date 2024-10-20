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
	productDosage: {
		type: String,
	},
	// variations: [
	// 	{
	// 		type: String,
	// 		// required: [true, 'Variation (e.g., size/color) is required'],
	// 	},
	// ],
	// stores: [
	// 	{
	// 		storeId: String,
	// 		stockLevel: {
	// 			type: Number,
	// 			required: [true, 'Stock level is required'],
	// 			min: [0, 'Stock level cannot be negative'],
	// 		},
	// 		lowStockThreshold: {
	// 			type: Number,
	// 			default: 10, // Customize as needed
	// 		},
	// 	},
	// ],
});

module.exports = mongoose.model('Stock', stockSchema);
