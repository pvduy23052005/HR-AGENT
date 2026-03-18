import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://phungvanduy23052005:trpt1D9TU6BllRh6@product-managerment.webbk.mongodb.net/hr-agent";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

const seedUser = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const email = 'test@test.com';
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log('User already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const newUser = new User({
      fullName: 'Test User',
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(`User created successfully: ${email} / password123`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
};

seedUser();
