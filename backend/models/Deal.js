const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true, maxlength: 300 },
  description:   { type: String, trim: true, default: '' },
  image:         { type: String, default: '' },
  price:         { type: Number, default: null },
  originalPrice: { type: Number, default: null },
  discount:      { type: Number, default: null, min: 0, max: 100 },
  store:         { type: String, default: 'Unknown' },
  brand:         { type: String, default: null },
  link:          { type: String, default: '' },
  keyFeatures:   [{ type: String }],

  // All posts are Protein — category kept for DB compat but always 'Protein'
  category: { type: String, default: 'Protein' },

  // What kind of post this is — detected by Groq from message content
  postType: {
    type: String,
    enum: ['Deal', 'Restock', 'PriceDrop', 'Review', 'Freebie', 'Update', 'Other'],
    default: 'Deal',
  },

  source:        { type: String, enum: ['telegram', 'reddit', 'manual'], required: true },
  sourceChannel: { type: String, default: '' },
  rawText:       { type: String, default: '' },

  votes:     { type: Number, default: 0 },
  votedBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  isExpired:   { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
  isVerified:  { type: Boolean, default: false },
  expiresAt:   { type: Date,    default: null },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

DealSchema.index({ createdAt: -1 });
DealSchema.index({ votes:     -1 });
DealSchema.index({ postType:   1 });
DealSchema.index({ brand:      1 });
DealSchema.index({ isExpired:  1 });
DealSchema.index({ discount:  -1 });
DealSchema.index({ title: 'text', description: 'text', brand: 'text', rawText: 'text' });

module.exports = mongoose.model('Deal', DealSchema);