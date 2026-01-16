const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    message: { type: String, required: true },
    reply: { type: String },
    replied_at: { type: Date },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', inquirySchema);
