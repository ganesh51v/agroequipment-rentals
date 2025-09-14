const { connectMySQL } = require('../config/mysql');

const seedEquipmentData = async () => {
  try {
    const connection = await connectMySQL();

    // Sample categories
    const categories = [
      { id: 1, name: 'Tractors', description: 'Various tractors' },
      { id: 2, name: 'Harvesters', description: 'Harvesting machines' },
      { id: 3, name: 'Seeders', description: 'Seeding equipment' }
    ];

    // Insert categories if not exist
    for (const category of categories) {
      await connection.execute(
        `INSERT IGNORE INTO categories (id, name, description) VALUES (?, ?, ?)`,
        [category.id, category.name, category.description]
      );
    }

    // Sample equipment data
    const equipmentData = [
      {
        name: 'Tractor Model X',
        description: 'Powerful tractor for all your farming needs.',
        category_id: 1,
        price_per_day: 1500,
        price_per_hour: 100,
        availability: true,
        specifications: JSON.stringify({ horsepower: '100 HP', fuel: 'Diesel' }),
        location: 'Farm Area 1',
        images: JSON.stringify(['tractor.jpg'])
      },
      {
        name: 'Combine Harvester 3000',
        description: 'Efficient harvester for large fields.',
        category_id: 2,
        price_per_day: 2500,
        price_per_hour: 180,
        availability: true,
        specifications: JSON.stringify({ capacity: '5 tons', fuel: 'Diesel' }),
        location: 'Farm Area 2',
        images: JSON.stringify(['combine_harvester.jpg'])
      },
      {
        name: 'Seed Drill Pro',
        description: 'Precision seeder for optimal planting.',
        category_id: 3,
        price_per_day: 1200,
        price_per_hour: 80,
        availability: true,
        specifications: JSON.stringify({ rows: 12, type: 'Mechanical' }),
        location: 'Farm Area 3',
        images: JSON.stringify(['seed_drill.jpg'])
      }
    ];

    // Insert equipment data
    for (const eq of equipmentData) {
      await connection.execute(
        `INSERT INTO equipment (name, description, category_id, price_per_day, price_per_hour, availability, specifications, location, images)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [eq.name, eq.description, eq.category_id, eq.price_per_day, eq.price_per_hour, eq.availability, eq.specifications, eq.location, eq.images]
      );
    }

    console.log('Sample equipment data seeded successfully.');
    await connection.end();
  } catch (error) {
    console.error('Error seeding equipment data:', error.message);
  }
};

if (require.main === module) {
  seedEquipmentData();
}

module.exports = seedEquipmentData;
