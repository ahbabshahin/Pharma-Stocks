const Invoice = require('../models/Invoice');
const Stock = require('../models/Stock');
const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const calculateTotal = (products, taxRate) => {
	const subtotal = products.reduce((acc, product) => {
		return acc + product.price * product.quantity;
	}, 0);
	const total = subtotal + subtotal * taxRate;
	return { subtotal, total };
};

// Create Invoice
const createInvoice = async (req, res) => {
	const { products, customer, sendPDF } = req.body;

	if (!products || !customer) {
		throw new CustomError.BadRequestError(
			'Products and customer are required'
		);
	}

	// Check stock availability for each product
	for (const product of products) {
		const stock = await Stock.findOne({ _id: product._id });

		if (!stock) {
			throw new CustomError.NotFoundError(
				`Product "${product.name}" not found in stock`
			);
		}

		if (product.quantity > stock.productQuantity) {
			throw new CustomError.BadRequestError(
				`Insufficient stock for product "${product.name}". Available quantity: ${stock.productQuantity}`
			);
		}
	}

	// Deduct stock quantities
	for (const product of products) {
		await Stock.findOneAndUpdate(
			{ productName: product.name },
			{ $inc: { productQuantity: -product.quantity } },
			{ new: true }
		);
	}

	// Calculate total and subtotal
	const { subtotal, total } = calculateTotal(products, 0.15);

	// Create the invoice
	const invoice = await Invoice.create({
		user: req.user.userId,
		products,
		customer,
		totalAmount: total,
	});

	// Generate PDF if requested
	if (sendPDF) {
		await generatePDF(invoice);
	}

	res.status(201).json({ invoice });
};

// Get All Invoices with Pagination and Filtering
const getAllInvoices = async (req, res) => {
	const { page = 1, limit = 10, status, user, customer } = req.query;

	const queryObject = {};
	if (status) queryObject.status = status;
	if (user) queryObject.user = user;
	if (customer) queryObject.customer = { $regex: customer, $options: 'i' }; // case-insensitive search

	const invoices = await Invoice.find(queryObject)
		.skip((page - 1) * limit)
		.limit(Number(limit))
		.populate('user', 'username email'); // Optional: populate user data

	const totalInvoices = await Invoice.countDocuments(queryObject);
	res.status(200).json({ body: invoices, total: totalInvoices, page: Number(page) });
};

// Get Single Invoice
const getInvoice = async (req, res) => {
	const { id } = req.params;

	const invoice = await Invoice.findById(id).populate(
		'user',
		'username email'
	);
	if (!invoice) {
		throw new CustomError.NotFoundError(`No invoice found with id: ${id}`);
	}

	res.status(200).json({ invoice });
};

// Update Invoice (Admin only)
const updateInvoice = async (req, res) => {
	const { id } = req.params;
	const { status } = req.body; // Only update status is allowed

	const invoice = await Invoice.findById(id);
	if (!invoice) {
		throw new CustomError.NotFoundError(`No invoice found with id: ${id}`);
	}

	// Admin authorization
	if (req.user.role !== 'admin') {
		throw new CustomError.UnauthorizedError(
			'Only admin can update invoice status'
		);
	}

	invoice.status = status;
	await invoice.save();

	res.status(200).json({ invoice });
};

// Delete Invoice
const deleteInvoice = async (req, res) => {
	const { id } = req.params;

	const invoice = await Invoice.findById(id);
	if (!invoice) {
		throw new CustomError.NotFoundError(`No invoice found with id: ${id}`);
	}

	await invoice.remove();
	res.status(204).send();
};

// Generate PDF
const generatePDF = (invoice) => {
	const doc = new PDFDocument();
	const filename = `invoice_${invoice._id}.pdf`;
	const writeStream = fs.createWriteStream(`./invoices/${filename}`);

	doc.pipe(writeStream);
	doc.fontSize(20).text(`Invoice ID: ${invoice._id}`);
	doc.text(`Customer: ${invoice.customer}`);
	doc.text(`Status: ${invoice.status}`);
	doc.text(`Total Amount: ${invoice.totalAmount}`);
	doc.text(`Created At: ${invoice.createdAt}`);

	doc.text('Products:');
	invoice.products.forEach((product) => {
		doc.text(
			`${product.name} - Quantity: ${product.quantity}, Price: ${product.price}`
		);
	});

	doc.end();

	return new Promise((resolve) => {
		writeStream.on('finish', resolve);
	});
};

module.exports = {
	createInvoice,
	getAllInvoices,
	getInvoice,
	updateInvoice,
	deleteInvoice,
	generatePDF,
};
