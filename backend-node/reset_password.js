const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const resetPassword = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = 'ruchitpar2004@gmail.com';
        const newPassword = 'password123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} NOT FOUND. Please Register first.`);
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password_hash = hashedPassword;

        await user.save();
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
