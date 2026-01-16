const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        if (!['agent', 'seller', 'admin'].includes(req.user.role)) {
            return res.send({ views: 0, inquiries: 0, conversion_rate: 0 });
        }

        const properties = await Property.find({ agent_id: req.user._id });
        const propertyIds = properties.map(p => p._id);

        if (propertyIds.length === 0) {
            return res.send({ views: 0, inquiries: 0, conversion_rate: 0 });
        }

        // 1. Total Views
        const total_views = properties.reduce((acc, p) => acc + p.views, 0);

        // 2. Total Inquiries
        const total_inquiries = await Inquiry.countDocuments({ property_id: { $in: propertyIds } });

        // 3. Applications / Bookings
        const total_bookings = await Booking.countDocuments({ property_id: { $in: propertyIds } });

        // Conversion Rate
        let conversion_rate = 0;
        if (total_views > 0) {
            conversion_rate = (total_bookings / total_views) * 100;
        }

        res.send({
            views: total_views,
            inquiries: total_inquiries,
            applications: total_bookings,
            conversion_rate: Number(conversion_rate.toFixed(1))
        });

    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

const Transaction = require('../models/Transaction');

// ... existing code ...

router.get('/sales', auth, async (req, res) => {
    try {
        if (!['agent', 'seller', 'admin'].includes(req.user.role)) {
            return res.status(403).send({ detail: 'Not authorized' });
        }

        const transactions = await Transaction.find({ seller_id: req.user._id })
            .populate('property_id', 'title location images')
            .populate('buyer_id', 'name email phone')
            .sort({ transaction_date: -1 });

        const total_earnings = transactions.reduce((acc, t) => acc + t.amount, 0);

        res.send({
            transactions,
            total_earnings,
            count: transactions.length
        });

    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

module.exports = router;
