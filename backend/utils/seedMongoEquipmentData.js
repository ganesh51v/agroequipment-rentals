const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');
const connectDB = require('../config/db');

const seedMongoEquipmentData = async () => {
  try {
    await connectDB();

    // Clear existing equipment data
    await Equipment.deleteMany({});

    // Sample equipment data
    const equipmentData = [
      {
        name: 'Tractor Model X',
        description: 'High-power tractor for ploughing, tilling, and planting. Suitable for all types of farming operations with excellent fuel efficiency and powerful engine.',
        category: new mongoose.Types.ObjectId(), // Placeholder, adjust if categories are in MongoDB
        subcategory: 'Tractors',
        price: 1876,
        priceType: 'daily',
        images: ['tractor.jpg'],
        specifications: { horsepower: '275 HP', fuel: 'Diesel', features: '4WD available, Power steering, Multiple attachments, GPS compatible' },
        availability: true,
        location: 'Farm Area 1',
        owner: new mongoose.Types.ObjectId(), // Placeholder, adjust as needed
        isActive: true
      },
      {
        name: 'Combine Harvester 3000',
        description: 'Efficiently harvest a variety of grain crops including wheat, rice, and corn. Features advanced threshing system and large grain tank capacity.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Harvesters',
        price: 2345,
        priceType: 'daily',
        images: ['combine_harvester.jpg'],
        specifications: { capacity: '5 tons', fuel: 'Diesel', features: 'Self-propelled, Large grain tank, Adjustable cutting width, GPS guidance' },
        availability: true,
        location: 'Farm Area 2',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Seed Drill Pro',
        description: 'Automate your seeding process for precision and speed. Ensures uniform seed placement and optimal spacing for maximum yield.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Seeders',
        price: 599,
        priceType: 'daily',
        images: ['seeddriller.jpg'],
        specifications: { rows: 12, type: 'Mechanical', features: 'Variable seed rate, Fertilizer attachment, Depth control, Metering system' },
        availability: true,
        location: 'Farm Area 3',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Power Weeder',
        description: 'Efficient weeding solution for row crops and vegetables. Saves time and labor while maintaining crop health.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Weeders',
        price: 399,
        priceType: 'daily',
        images: ['powerweeder.jpg'],
        specifications: { power: '2 HP', fuel: 'Petrol', features: 'Lightweight design, Easy maneuverability, Adjustable tines, Fuel efficient' },
        availability: true,
        location: 'Farm Area 4',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Reaper Machine',
        description: 'Perfect for harvesting cereals and pulses efficiently. Compact design suitable for small to medium farms.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Harvesters',
        price: 899,
        priceType: 'daily',
        images: ['reapermachine.jpg'],
        specifications: { capacity: '2 tons', fuel: 'Diesel', features: 'Portable design, Easy operation, Sharp cutting blades, Low maintenance' },
        availability: true,
        location: 'Farm Area 5',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Power Sprayer',
        description: 'High-pressure spraying for pesticides and fertilizers. Ensures even coverage and effective pest control.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Sprayers',
        price: 299,
        priceType: 'daily',
        images: ['powersprayer.jpg'],
        specifications: { tank: '20L', pressure: 'High', features: 'High pressure pump, Adjustable nozzle, Large tank capacity, Easy operation' },
        availability: true,
        location: 'Farm Area 6',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Cultivator',
        description: 'Soil preparation and weed control between crop rows. Essential tool for maintaining healthy crop growth.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Cultivators',
        price: 449,
        priceType: 'daily',
        images: ['cultivator.jpg'],
        specifications: { width: '6 feet', tines: 9, features: 'Multiple tine options, Adjustable width, Durable construction, Easy attachment' },
        availability: true,
        location: 'Farm Area 7',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      },
      {
        name: 'Rotary Tiller',
        description: 'Perfect for preparing seedbeds for gardens and farms. Ideal for soil preparation, weed control, and mixing organic matter into soil.',
        category: new mongoose.Types.ObjectId(),
        subcategory: 'Tillers',
        price: 499,
        priceType: 'daily',
        images: ['rotatry triller.png'],
        specifications: { width: '4 feet', depth: 'Adjustable', features: 'Multiple blade options, PTO driven, Adjustable depth, Compact design' },
        availability: true,
        location: 'Farm Area 8',
        owner: new mongoose.Types.ObjectId(),
        isActive: true
      }
    ];

    await Equipment.insertMany(equipmentData);

    console.log('Sample equipment data seeded into MongoDB successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding equipment data into MongoDB:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedMongoEquipmentData();
}

module.exports = seedMongoEquipmentData;
