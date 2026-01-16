const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        if (!['agent', 'seller', 'admin'].includes(req.user.role)) {
            return res.send({ views: 0, inquiries: 0, conversion_rate: 0 });
        }

        let properties;
        if (req.user.role === 'admin') {
            properties = await Property.find({});
        } else {
            properties = await Property.find({ agent_id: req.user._id });
        }
        const propertyIds = properties.map(p => p._id);

        let views = 0;
        let inquiries = 0;
        let bookings = 0;
        let conversion_rate = 0;

        if (propertyIds.length > 0) {
            views = properties.reduce((acc, p) => acc + p.views, 0);
            inquiries = await Inquiry.countDocuments({ property_id: { $in: propertyIds } });
            bookings = await Booking.countDocuments({ property_id: { $in: propertyIds } });

            if (views > 0) {
                conversion_rate = (bookings / views) * 100;
            }
        }

        const responseData = {
            views,
            inquiries,
            applications: bookings,
            conversion_rate: Number(conversion_rate.toFixed(1))
        };

        if (req.user.role === 'admin') {
            const allTransactions = await Transaction.find({});
            const total_fees = allTransactions.reduce((acc, t) => acc + (t.platform_fee || 0), 0);
            const users = await User.find({}, '-password_hash');

            responseData.total_fees = total_fees;
            responseData.users = users;
        }

        res.send(responseData);

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
