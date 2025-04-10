import mongoose from 'mongoose';

const companyInsightSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  alumniContributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  details: {
    overview: String,
    culture: String,
    hiringProcess: String,
    benefits: [String],
    workLifeBalance: String,
  },
  insights: [{
    type: {
      type: String,
      enum: ['interview', 'work_culture', 'compensation', 'growth'],
      required: true,
    },
    content: String,
    rating: Number,
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
  verified: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const CompanyInsight = mongoose.models.CompanyInsight || mongoose.model('CompanyInsight', companyInsightSchema);

export default CompanyInsight; 