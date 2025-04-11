import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'career-guidance',
      'technical-skills',
      'soft-skills',
      'interview-preparation',
      'resume-building',
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ['link', 'document', 'video'],
  },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.type === 'link') {
          try {
            new URL(v);
            return true;
          } catch (e) {
            return false;
          }
        }
        return true;
      },
      message: 'URL is required and must be valid for link type resources',
    },
  },
  content: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return this.type !== 'document' || v.length > 0;
      },
      message: 'Content is required for document type resources',
    },
  },
  tags: [String],
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  metadata: {
    company: String,
    role: String,
    difficulty: String,
    experience: String,
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

resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

export default Resource; 