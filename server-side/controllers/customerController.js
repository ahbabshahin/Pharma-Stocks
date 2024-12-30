const Customer = require('../models/Customer');
const CustomError = require('../errors');

// Create a new customer
const createCustomer = async (req, res) => {
	const { name, contacts, address } = req.body;

	try {
		const customer = await Customer.create({ name, contacts, address });
		res.status(201).json({
			message: 'Customer created successfully',
			customer,
		});
	} catch (error) {
		if (error.code === 11000) {
			return res
				.status(400)
				.json({ message: 'Duplicate value for name or contacts' });
		}
		res.status(500).json({ message: 'Server error', error });
	}
};

// Get all customers
const getAllCustomers = async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	try {
		const customers = await Customer.find()
			.skip((page - 1) * limit)
			.limit(Number(limit));

		const totalCustomers = await Customer.countDocuments();
		res.status(200).json({ customers, total: totalCustomers, page });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Get single customer
const getCustomer = async (req, res) => {
	const { id } = req.params;

	try {
		const customer = await Customer.findById(id);
		if (!customer) {
			throw new CustomError.NotFoundError(
				`No customer found with ID: ${id}`
			);
		}

		res.status(200).json({ customer });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Update customer
const updateCustomer = async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	try {
		const customer = await Customer.findById(id);
		if (!customer) {
			throw new CustomError.NotFoundError(
				`No customer found with ID: ${id}`
			);
		}

		// Update customer fields dynamically
		Object.keys(updates).forEach((key) => {
			if (key in customer) {
				customer[key] = updates[key];
			}
		});

		await customer.save();
		res.status(200).json({
			message: 'Customer updated successfully',
			customer,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Delete customer
const deleteCustomer = async (req, res) => {
	const { id } = req.params;

	try {
		const customer = await Customer.findById(id);
		if (!customer) {
			throw new CustomError.NotFoundError(
				`No customer found with ID: ${id}`
			);
		}

		await customer.remove();
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

// Update customer's invoices array
const updateCustomerInvoices = async (req, res) => {
	const { customerId } = req.params;
	const { invoiceId } = req.body;

	try {
		const customer = await Customer.findById(customerId);
		if (!customer) {
			throw new CustomError.NotFoundError(
				`No customer found with ID: ${customerId}`
			);
		}

		if (!invoiceId) {
			return res.status(400).json({ message: 'Invoice ID is required' });
		}

		// Update the invoices array
		customer.invoices.push(invoiceId);
		await customer.save();

		res.status(200).json({
			message: 'Invoice added to customer successfully',
			customer,
		});
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

const searchCustomers = async (req, res) => {
	const { name } = req.query; // Get the search query from query parameters

	if (!name) {
		throw new CustomError.BadRequestError(
			'Search query "name" is required'
		);
	}

	try {
		const customers = await Customer.find({
			name: { $regex: name, $options: 'i' }, // Case-insensitive partial match
		});

		if (customers.length === 0) {
			return res.status(404).json({ message: 'No customers found' });
		}

		res.status(200).json({ customers });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};

module.exports = {
	createCustomer,
	getAllCustomers,
	getCustomer,
	updateCustomer,
	deleteCustomer,
	updateCustomerInvoices,
	searchCustomers,
};
