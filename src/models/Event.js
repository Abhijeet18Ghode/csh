import mongoose from 'mongoose';

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
  category: {
    type: String,
    required: true,
    enum: ['workshop', 'webinar', 'networking', 'conference'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
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
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  meetingDetails: {
    type: {
      type: String,
      enum: ['in-person', 'online', 'hybrid'],
      default: 'in-person',
    },
    platform: {
      type: String,
      enum: ['zoom', 'google-meet', 'microsoft-teams', 'other'],
    },
    meetingLink: String,
    meetingId: String,
    meetingPassword: String,
    meetingInstructions: String,
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

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Delete the old model if it exists
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

// Create the new model
const Event = mongoose.model('Event', eventSchema);
export default Event; 