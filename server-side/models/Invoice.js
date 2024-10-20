const invoiceSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			name: String,
			quantity: {
				type: Number,
				min: [1, 'Quantity must be at least 1'],
			},
			price: {
				type: Number,
				min: [0, 'Price must be a positive value'],
			},
		},
	],
	taxRate: {
		type: Number,
		default: 0.15, // 15% tax rate
	},
	totalAmount: Number,
	status: {
		type: String,
		enum: ['paid', 'unpaid', 'overdue'],
		default: 'unpaid',
	},
	customer: String, // You could add more validation based on your requirements
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

invoiceSchema.pre('save', function (next) {
	let total = 0;
	this.products.forEach((product) => {
		total += product.price * product.quantity;
	});
	this.totalAmount = total + total * this.taxRate;
	next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
