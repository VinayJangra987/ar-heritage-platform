const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected');
  try {
    const user = await User.create({
      name: 'Vinay',
      email: 'test999@test.com',
      password: '123456'
    });
    console.log('✅ USER CREATED:', user._id);
  } catch(err) {
    console.log('❌ ERROR:', err.message);
  }
  process.exit();
});