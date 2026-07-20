require('dotenv').config();
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const seedAdmin = async () => {
  await connectDB();

  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log(' Admin already exists:', existing.email);
    process.exit(0);
  }

  await User.create({
    name: process.env.ADMIN_NAME || "Super Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
    isActive: true,
  });

  console.log('Super Admin created successfully!');
  console.log('Email:', process.env.ADMIN_EMAIL);
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
