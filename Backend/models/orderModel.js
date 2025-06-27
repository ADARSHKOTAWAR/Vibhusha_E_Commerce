import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, require: false },
    items: { type: Array, require: true },
    amount: { type: Number, require: true },
    address: { type: Object, require: false },
    status: { type: String, require: true, default: 'Order Placed' },
    paymentMedhod: { type: String, require: true },
    payment: { type: Boolean, require: true, default:false },
    date: {type: Number, required: true},

    orderSource: {type: String, enum: ['online', 'offline'], default: 'online'},
    customerName: {type: String, required: false},
    customerPhone: {type: String, required: false},
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;