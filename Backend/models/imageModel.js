import mongoose from 'mongoose';

const heroImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true, 
  },
  alt: {
    type: String,
    required: true,
    default: 'E-commerce Hero Image', 
  },
  public_id: {
    type: String,
    unique: true,
    sparse: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HeroImage = mongoose.model('HeroImage', heroImageSchema);

export default HeroImage;