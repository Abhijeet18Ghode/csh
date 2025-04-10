import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'mentorship_request',
      'mentorship_accepted',
      'mentorship_rejected',
      'event_reminder',
      'content_approved',
      'content_rejected',
      'report_resolved',
      'new_message',
      'system_announcement'
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  relatedType: {
    type: String,
    enum: ['resource', 'event', 'company_insight', 'mentorship_session', 'report'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification; 