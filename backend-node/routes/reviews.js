const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// POST / - Add a review
router.post('/', auth, async (req, res) => {
    try {
        const { agent_id, property_id, rating, comment } = req.body;

        if (req.user._id.toString() === agent_id) {
            return res.status(400).send({ detail: 'You cannot review yourself' });
        }

        const review = new Review({
            agent_id,
            reviewer_id: req.user._id,
            property_id,
            rating,
            comment
        });

        await review.save();
        res.send(review);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// GET /:agentId - Get reviews for an agent
router.get('/:agentId', async (req, res) => {
    try {
        const reviews = await Review.find({ agent_id: req.params.agentId })
            .populate('reviewer_id', 'name')
            .sort({ created_at: -1 });
        res.send(reviews);
    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

module.exports = router;
