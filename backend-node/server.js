const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    maxAge: '1d', // Cache images for 1 day
    etag: true
}));

// Database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        console.log('Please ensure MongoDB is running.');
    });

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/properties', require('./routes/properties'));
app.use('/inquiries', require('./routes/inquiries'));
app.use('/bookings', require('./routes/bookings'));
app.use('/analytics', require('./routes/analytics'));
app.use('/reviews', require('./routes/reviews'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Real Estate API (Node.js)' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server successfully restarted with latest updates (4).');
});
