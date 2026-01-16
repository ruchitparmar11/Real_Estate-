const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Configure Multer for MEMORY storage (Base64)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB to prevent DB bloat
});

// POST /upload - Upload Image (Base64)
router.post('/upload', auth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ detail: 'No file uploaded' });
        }

        // Convert buffer to Base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const mimeType = req.file.mimetype;
        const dataURI = `data:${mimeType};base64,${b64}`;

        // Return the Data URI as the URL
        res.send({ url: dataURI });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// GET / - List properties
router.get('/', async (req, res) => {
    try {
        const { type, location, min_price, max_price, search, agent_id, skip = 0, limit = 100 } = req.query;
        const query = {};

        if (type) query.type = type;
        if (location) query.location = { $regex: location, $options: 'i' };

        if (min_price || max_price) {
            query.price = {};
            if (min_price) query.price.$gte = Number(min_price);
            if (max_price) query.price.$lte = Number(max_price);
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }
        if (agent_id) query.agent_id = agent_id;

        const properties = await Property.find(query)
            .sort({ isFeatured: -1, created_at: -1 })
            .limit(Number(limit))
            .skip(Number(skip));
        res.send(properties);
    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

// GET /purchased - My purchases
router.get('/purchased', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ buyer_id: req.user._id });
        const propertyIds = transactions.map(t => t.property_id);
        const properties = await Property.find({ _id: { $in: propertyIds } });
        res.send(properties);
    } catch (e) {
        res.status(500).send({ detail: e.message });
    }
});

// POST / - Create Property
router.post('/', auth, async (req, res) => {
    try {
        if (!['agent', 'admin', 'seller'].includes(req.user.role)) {
            return res.status(403).send({ detail: 'Not authorized to create listings' });
        }

        const property = new Property({
            ...req.body,
            agent_id: req.user._id
        });
        await property.save();
        res.send(property);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// GET /:id - Get one
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('agent_id', 'name email phone');
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        // Increment views
        property.views += 1;
        await property.save();

        res.send(property);
    } catch (e) {
        res.status(404).send({ detail: 'Property not found' });
    }
});

// PUT /:id - Update
router.put('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized to update this listing' });
        }

        Object.assign(property, req.body);
        await property.save();
        res.send(property);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// DELETE /:id - Delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized to delete this listing' });
        }

        await Property.deleteOne({ _id: req.params.id });
        res.status(204).send();
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// POST /:id/images - Add image
router.post('/:id/images', auth, async (req, res) => {
    try {
        const { image_url } = req.body;
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized to add images' });
        }

        property.images.push({ image_url });
        await property.save();
        res.send(property);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// DELETE /:id/images/:imageId - Delete image
router.delete('/:id/images/:imageId', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (req.user.role !== 'admin' && property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized to delete images' });
        }

        // Find the image subdocument
        const image = property.images.id(req.params.imageId);
        if (!image) return res.status(404).send({ detail: 'Image not found' });

        // Remove it using pull
        property.images.pull(req.params.imageId);
        await property.save();

        res.send(property);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// POST /:id/buy - Buy Property
router.post('/:id/buy', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (property.status === 'sold') {
            return res.status(400).send({ detail: 'Property is already sold' });
        }

        const platformFee = property.price * 0.01; // 1% Fee

        const transaction = new Transaction({
            property_id: property._id,
            buyer_id: req.user._id,
            seller_id: property.agent_id,
            amount: property.price,
            platform_fee: platformFee,
            status: 'completed'
        });

        property.status = 'sold';

        await transaction.save();
        await property.save();

        res.send({ message: 'Congratulations! Property purchased successfully.', transaction_id: transaction._id });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// POST /:id/promote - Feature a property (Mock Payment)
router.post('/:id/promote', auth, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).send({ detail: 'Property not found' });

        if (property.agent_id.toString() !== req.user._id.toString()) {
            return res.status(403).send({ detail: 'Not authorized' });
        }

        // Here we would process payment (Stripe/PayPal)
        // For now, we assume it's successful
        property.isFeatured = true;
        await property.save();

        res.send({ message: 'Property promoted successfully!', property });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

module.exports = router;
