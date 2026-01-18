const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.get('/users/:id/details', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).send({ detail: 'Not authorized' });
        }

        const user = await User.findById(req.params.id, '-password_hash');
        if (!user) {
            return res.status(404).send({ detail: 'User not found' });
        }

        const purchases = await Transaction.find({ buyer_id: req.params.id })
            .populate('property_id', 'title location images')
            .sort({ transaction_date: -1 });

        const sales = await Transaction.find({ seller_id: req.params.id })
            .populate('property_id', 'title location images')
            .sort({ transaction_date: -1 });



        const listings = await Property.find({ agent_id: req.params.id })
            .select('title location price images status')
            .sort({ created_at: -1 });

        res.send({
            user,
            purchases,
            sales,
            listings,
            property_count: listings.length
        });

    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

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
            // Use aggregation to calculate total fees efficiently in the DB
            const feesAggregation = await Transaction.aggregate([
                { $group: { _id: null, total: { $sum: "$platform_fee" } } }
            ]);
            const total_fees = feesAggregation.length > 0 ? feesAggregation[0].total : 0;

            // Limit users to the most recent 50 to avoid slow responses
            const users = await User.find({}, '-password_hash')
                .sort({ created_at: -1 })
                .limit(50);

            responseData.total_fees = total_fees;
            responseData.users = users;
        }

        res.send(responseData);

    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

// Transaction model moved to top

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
