const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
		unique: true,
		minlength: [3, 'Name must be at least 3 characters long'],
	},
	phoneNumber: {
		type: String,
		required: [true, 'Phone number is required'],
		unique: true,
	},
	address: {
		type: String,
		required: [true, 'Address is required'],
		minlength: [3, 'Address must be at least 3 characters long'],
	},
});

module.exports = mongoose.model('Customer', customerSchema);
