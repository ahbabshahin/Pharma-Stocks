const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Username is required'],
		unique: true,
		minlength: [3, 'Username must be at least 3 characters long'],
	},
	email: {
		type: String,
		required: [true, 'Email is required'],
		unique: true,
		validate: {
			validator: (v) => validator.isEmail(v),
			message: (props) => `${props.value} is not a valid email`,
		},
	},
	password: {
		type: String,
		required: [true, 'Password is required'],
		minlength: [6, 'Password must be at least 6 characters long'],
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user',
	},
});

module.exports = mongoose.model('User', userSchema);
