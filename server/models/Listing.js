import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  type: { type: String, enum: ['apartment', 'room', 'shared'], required: true },
  bills: { type: String, default: 'Ekstra' },
  occupants: { type: Number, default: 0 },
  missing: { type: Number, default: 0 },
  isFull: { type: Boolean, default: false },
  image: { type: String, default: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop' },
  images: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Listing', ListingSchema);
