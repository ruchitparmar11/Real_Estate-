const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const auth = require('../middleware/auth');

// POST / - Create Booking
router.post('/', auth, async (req, res) => {
    try {
        const { property_id, slot_time } = req.body;
        const property = await Property.findById(property_id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        try {
            new Date(slot_time).toISOString();
        } catch (e) {
            return res.status(400).send({ detail: 'Invalid date format' });
        }

        const booking = new Booking({
            user_id: req.user._id,
            property_id,
            slot_time
        });
        await booking.save();
        res.send(booking);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// GET / - List Bookings
router.get('/', auth, async (req, res) => {
    try {
        let queries = {};
        if (req.user.role === 'admin') {
            // All
        } else if (['agent', 'seller'].includes(req.user.role)) {
            const properties = await Property.find({ agent_id: req.user._id }, '_id');
            const propertyIds = properties.map(p => p._id);
            queries = { property_id: { $in: propertyIds } };
        } else {
            queries = { user_id: req.user._id };
        }

        const bookings = await Booking.find(queries);
        res.send(bookings);
    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

// PUT /:id/status - Update Status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).send({ detail: 'Booking not found' });

        const property = await Property.findById(booking.property_id);
        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();
        res.send(booking);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

module.exports = router;
