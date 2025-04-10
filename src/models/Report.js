import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  contentType: {
    type: String,
    enum: ['resource', 'event', 'company_insight', 'mentorship_session'],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
  },
  resolution: {
    action: String,
    notes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
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

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report; 