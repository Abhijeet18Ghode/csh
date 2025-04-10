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
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
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
    location: String, // For offline sessions
  },
  feedback: {
    mentorFeedback: {
      rating: Number,
      comment: String,
      submittedAt: Date,
    },
    studentFeedback: {
      rating: Number,
      comment: String,
      submittedAt: Date,
    },
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
  permissions: {
    student: {
      canCancel: { type: Boolean, default: true },
      canReschedule: { type: Boolean, default: true },
      canProvideFeedback: { type: Boolean, default: true },
    },
    mentor: {
      canCancel: { type: Boolean, default: true },
      canReschedule: { type: Boolean, default: true },
      canProvideFeedback: { type: Boolean, default: true },
    },
    admin: {
      canModify: { type: Boolean, default: true },
      canDelete: { type: Boolean, default: true },
    },
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

// Add indexes for better query performance
mentorshipSessionSchema.index({ mentorId: 1, status: 1 });
mentorshipSessionSchema.index({ studentId: 1, status: 1 });
mentorshipSessionSchema.index({ status: 1 });

const MentorshipSession = mongoose.models.MentorshipSession || mongoose.model('MentorshipSession', mentorshipSessionSchema);

export default MentorshipSession; 