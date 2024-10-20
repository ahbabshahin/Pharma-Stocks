const invoiceSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			name: String,
			quantity: Number,
			price: Number,
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
	customer: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Invoice', invoiceSchema);
