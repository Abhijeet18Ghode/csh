require('dotenv').config();
const mongoose = require('mongoose');

async function resetEventSchema() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the events collection
    await mongoose.connection.db.collection('events').drop();
    console.log('Events collection dropped');

    // Create new schema
    const eventSchema = new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      maxParticipants: {
        type: Number,
        required: true,
        min: 1,
      },
      registeredUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    });

    // Create the new model
    mongoose.model('Event', eventSchema);
    console.log('New Event schema created');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error resetting Event schema:', error);
    process.exit(1);
  }
}

resetEventSchema(); 