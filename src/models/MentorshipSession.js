import mongoose from 'mongoose';

const mentorshipSessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  sessionDetails: {
    date: Date,
    duration: Number,
    mode: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    meetingLink: String,
    agenda: String,
  },
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date,
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const MentorshipSession = mongoose.models.MentorshipSession || mongoose.model('MentorshipSession', mentorshipSessionSchema);

export default MentorshipSession; 