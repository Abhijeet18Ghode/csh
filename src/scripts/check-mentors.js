const { connectDB } = require('../lib/db');
const User = require('../models/User');

async function checkMentors() {
  try {
    await connectDB();
    const mentors = await User.find({ role: 'mentor' });
    console.log('Mentors in database:', mentors);
  } catch (error) {
    console.error('Error checking mentors:', error);
  }
}

checkMentors(); 