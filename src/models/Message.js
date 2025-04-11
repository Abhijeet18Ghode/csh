import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'file', 'emoji'],
    default: 'text',
  },
  fileUrl: String,
  fileName: String,
  fileType: String,
  fileSize: Number,
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
}, {
  timestamps: true,
});

messageSchema.index({ resourceId: 1, createdAt: -1 });

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message; 