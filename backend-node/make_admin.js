const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeAdmin = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate';
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const email = 'ruchitpar2004@gmail.com';
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User with email ${email} not found!`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

makeAdmin();
