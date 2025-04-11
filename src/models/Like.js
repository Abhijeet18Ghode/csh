import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index to ensure a user can only like a resource once
likeSchema.index({ resource: 1, user: 1 }, { unique: true });

// Add a method to check if a user has liked a resource
likeSchema.statics.hasLiked = async function(resourceId, userId) {
  return await this.exists({ resource: resourceId, user: userId });
};

// Add a method to get like count for a resource
likeSchema.statics.getLikeCount = async function(resourceId) {
  return await this.countDocuments({ resource: resourceId });
};

const Like = mongoose.models.Like || mongoose.model('Like', likeSchema);

export default Like; 