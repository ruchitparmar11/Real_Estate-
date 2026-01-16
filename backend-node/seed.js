const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Property = require('./models/Property');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});

        // Create Agent
        const passwordHash = await bcrypt.hash('password123', 8);
        const agent = new User({
            email: 'agent@example.com',
            password_hash: passwordHash,
            name: 'John Agent',
            role: 'agent',
            phone: '123-456-7890'
        });
        await agent.save();

        // Create Properties
        const properties = [
            {
                title: 'Modern Apartment in City Center',
                description: 'A beautiful 2-bedroom apartment with a great view of the city skyline. Close to all amenities.',
                price: 450000,
                location: 'New York, NY',
                type: 'sale',
                features: '2 Beds, 2 Baths, Balcony, Gym',
                status: 'approved',
                agent_id: agent._id,
                images: [{ image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267' }]
            },
            {
                title: 'Cozy Cottage in the Woods',
                description: 'Escape to nature in this charming cottage. Perfect for weekends or a peaceful retreat.',
                price: 2500,
                location: 'Vermont',
                type: 'rent',
                features: '1 Bed, 1 Bath, Fireplace, Garden',
                status: 'approved',
                agent_id: agent._id,
                images: [{ image_url: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c' }]
            },
            {
                title: 'Luxury Villa with Pool',
                description: 'Experience luxury living in this spacious villa. Features a private pool and large garden.',
                price: 1200000,
                location: 'Los Angeles, CA',
                type: 'sale',
                features: '5 Beds, 4 Baths, Pool, Garage',
                status: 'approved',
                agent_id: agent._id,
                images: [{ image_url: 'https://images.unsplash.com/photo-1613490493576-2f080c5379dc' }]
            },
            {
                title: 'Modern Loft',
                description: 'Open plan loft in a trendy neighborhood. High ceilings and industrial style.',
                price: 3500,
                location: 'Chicago, IL',
                type: 'rent',
                features: '1 Bed, 1 Bath, Open Plan, Near Transit',
                status: 'approved',
                agent_id: agent._id,
                images: [{ image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' }]
            },
            {
                title: 'Beachfront Condo',
                description: 'Wake up to the sound of waves. Direct beach access and stunning sunsets.',
                price: 750000,
                location: 'Miami, FL',
                type: 'sale',
                features: '2 Beds, 2 Baths, Ocean View, Pool',
                status: 'approved',
                agent_id: agent._id,
                images: [{ image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' }]
            }
        ];

        await Property.insertMany(properties);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
