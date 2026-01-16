const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // sale or rent
    features: { type: String }, // Comma separated string
    status: {
        type: String,
        enum: ['pending', 'approved', 'sold', 'rented'],
        default: 'pending'
    },
    views: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{
        image_url: String
    }],
    created_at: { type: Date, default: Date.now }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Property', propertySchema);
