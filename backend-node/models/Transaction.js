const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    status: { type: String, default: 'completed' },
    transaction_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
