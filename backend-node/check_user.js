const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        console.log('Connecting to:', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = 'ruchitpar2004@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User ${email} NOT FOUND.`);
        } else {
            console.log(`User Found: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Current Role: ${user.role}`);
            console.log(`ID: ${user._id}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
