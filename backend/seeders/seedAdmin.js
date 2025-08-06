// backend/seeders/seedAdmin.js
require('dotenv').config({ path: '../.env' }); // Adjust path as needed
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Ensure path is correct

const seedAdmin = async () => {
  try {
    // 1. Connect to MongoDB (we need to connect directly for this script)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // 2. Define the Admin details (as requested, a "static" account)
    const adminEmail = 'admin@sms.com';
    const adminPassword = 'adminpassword123';
    const adminFullName = 'System Admin';

    // 3. Check if the admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists. Skipping seeding.');
      await mongoose.connection.close();
      return;
    }

    // 4. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // 5. Create and save the admin user
    const adminUser = new User({
      fullName: adminFullName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin', // This is crucial
    });

    await adminUser.save();
    console.log(`Successfully seeded Admin user: ${adminEmail}`);

    await mongoose.connection.close();

  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();