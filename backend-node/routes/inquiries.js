const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// POST / - Create Inquiry
router.post('/', auth, async (req, res) => {
    try {
        const { property_id, message } = req.body;
        const property = await Property.findById(property_id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        const inquiry = new Inquiry({
            user_id: req.user._id,
            property_id,
            message
        });
        await inquiry.save();
        res.send(inquiry);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// GET / - List Inquiries
router.get('/', auth, async (req, res) => {
    try {
        let queries = {};
        if (req.user.role === 'admin') {
            // All
        } else if (['agent', 'seller'].includes(req.user.role)) {
            // Find properties by this agent
            const properties = await Property.find({ agent_id: req.user._id }, '_id');
            const propertyIds = properties.map(p => p._id);
            queries = { property_id: { $in: propertyIds } };
        } else {
            // Regular user
            queries = { user_id: req.user._id };
        }

        const inquiries = await Inquiry.find(queries)
            .populate('property_id', 'title images')
            .populate('user_id', 'name email phone');
        res.send(inquiries);
    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

// POST /:id/reply - Reply
router.post('/:id/reply', auth, async (req, res) => {
    try {
        const { message } = req.body; // or req.query? Python had Body.
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).send({ detail: 'Inquiry not found' });

        const property = await Property.findById(inquiry.property_id);

        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized to reply' });
        }

        inquiry.reply = message;
        inquiry.replied_at = new Date();
        await inquiry.save();
        res.send(inquiry);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

module.exports = router;
