const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../middleware/auth');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { sendWelcomeEmail } = require('../utils/mailer');

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ detail: 'Email already registered' });
        }

        const password_hash = await bcrypt.hash(password, 8);
        const user = new User({
            email,
            password_hash,
            name,
            role: role || 'buyer',
            phone
        });
        await user.save();

        // Send welcome email asynchronously (don't await to delay response)
        sendWelcomeEmail(email, name);

        const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });

        const userObj = user.toObject();
        delete userObj.password_hash;

        res.send({ access_token: token, token_type: 'bearer', user: userObj });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Frontend sends username (email) and password in form-data usually or JSON
        // Fastapi OAuth2PasswordRequestForm expects username/password.
        // Frontend might be sending JSON { username, password } or { email, password }
        // I'll support both email and username field for convenience.
        const { username, email, password } = req.body;
        const userEmail = email || username;

        const user = await User.findOne({ email: userEmail });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).send({ detail: 'Incorrect email or password' });
        }

        const token = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
        const userObj = user.toObject();
        delete userObj.password_hash;

        res.send({ access_token: token, token_type: 'bearer', user: userObj });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            // Create new user with random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const password_hash = await bcrypt.hash(randomPassword, 8);

            user = new User({
                email,
                password_hash,
                name: name || email.split('@')[0],
                role: 'visitor',
                phone: null
            });
            await user.save();
            sendWelcomeEmail(email, name || email.split('@')[0]);
        }

        const jwtToken = jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
        const userObj = user.toObject();
        delete userObj.password_hash;

        res.send({ access_token: jwtToken, token_type: 'bearer', user: userObj });
    } catch (e) {
        res.status(400).send({ detail: 'Invalid Google token' });
    }
});

// Get Me
router.get('/me', auth, async (req, res) => {
    const userObj = req.user.toObject();
    delete userObj.password_hash;
    res.send(userObj);
});

// Update Profile (Phone, etc)
router.put('/profile', auth, async (req, res) => {
    try {
        const { phone, name } = req.body;
        if (phone) req.user.phone = phone;
        if (name) req.user.name = name;

        await req.user.save();

        const userObj = req.user.toObject();
        delete userObj.password_hash;
        res.send(userObj);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// Request Verification
router.post('/request-verification', auth, async (req, res) => {
    try {
        req.user.verificationStatus = 'pending';
        await req.user.save();
        res.send({ message: 'Verification requested successfully', user: req.user });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// Admin Verify User (Protected in real app, simplified here)
router.post('/admin/verify-user', auth, async (req, res) => {
    try {
        const { userId, status } = req.body; // status: 'verified' or 'rejected'
        // In real app: Check if req.user.role === 'admin'

        const user = await User.findById(userId);
        if (!user) return res.status(404).send({ detail: 'User not found' });

        user.verificationStatus = status;
        user.isVerified = status === 'verified';
        await user.save();

        res.send({ message: `User ${status}`, user });
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

// Update Role
router.put('/role', auth, async (req, res) => {
    try {
        const { role } = req.body;
        req.user.role = role;
        await req.user.save();

        const userObj = req.user.toObject();
        delete userObj.password_hash;
        res.send(userObj);
    } catch (e) {
        res.status(400).send({ detail: e.message });
    }
});

module.exports = router;
