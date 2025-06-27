import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },

    // Detailed pricing
    MRP: { type: Number, required: true },
    discount: { type: Number, required: true },
    price: { type: Number, required: true },

    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: [
        {
            size: {type: String, required: true},
            quantity: {type: Number, required: true}
        }
    ],
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    publish: { type: Boolean, default: false },

    // Newly added fields
    baseMetal: { type: String },
    color: { type: String, required: true },        // Now required
    occasion: { type: String },
    plating: { type: String },
    stoneType: { type: String },
    trend: { type: String }
});


const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;