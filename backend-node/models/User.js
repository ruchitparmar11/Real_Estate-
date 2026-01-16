const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['visitor', 'buyer', 'tenant', 'agent', 'seller', 'admin'],
        default: 'buyer'
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
