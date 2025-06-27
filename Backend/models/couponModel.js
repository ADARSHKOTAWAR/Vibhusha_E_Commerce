import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code:{type: String, required: true, unique: true, uppercase: true, trim: true},
    description: {type: String},
    discountType: {type: String, enum:['percent', 'amount'], required: true},
    discountValue: {type: Number, required: true},
    appliesTo: {type: String, enum:['all', 'product', 'category', 'subcategory', 'user', 'cartTotal'], default:'all'},
    specificValue: {type: String},
    minCartValue: {type: Number},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    usageType: {type: String, enum: ['once', 'unlimited', 'limited'], default:'once'},
    published: {type: Boolean, default: false},
    usageLimit: {type: Number, default: 1},
    usageCount: {type: Number, default:0},
    expiryDate: {type: Date},
    createdAt: {type: Date, default: Date.now}
});

const couponModel =  mongoose.models.coupon || mongoose.model('coupon', couponSchema);

export default couponModel;