const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' }, // Optional, confirming they interacted via this property
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
