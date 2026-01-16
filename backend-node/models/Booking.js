const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    slot_time: { type: Date, required: true },
    status: { type: String, default: 'pending' }, // pending, confirmed, cancelled
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
