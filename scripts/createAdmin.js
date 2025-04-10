require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../src/lib/mongodb');
const User = require('../src/models/User');

async function createAdmin() {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@alumnet.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@alumnet.com',
      password: hashedPassword,
      role: 'admin',
      verified: true,
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 