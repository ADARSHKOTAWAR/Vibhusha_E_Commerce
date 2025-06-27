import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res)  => {

    try {
       
        const {name, description, MRP, discount, price, category, subCategory, sizes, bestseller, baseMetal, color, occasion, plating, stoneType, trend, publish} = req.body;
        //console.log(name, description, MRP, discount, category, subCategory, sizes, bestseller, baseMetal, color, occasion, plating, stoneType, trend, publish);
        

        // const image1 = req.files.image1 && req.files.image1[0];
        // const image2 = req.files.image2 && req.files.image2[0];
        // const image3 = req.files.image3 && req.files.image3[0];
        // const image4 = req.files.image4 && req.files.image4[0];/

        if (!name || !description || !MRP || !discount || !price || !category || !subCategory || !sizes || !color) {
            return res.json({ success: false, message: "Missing Required Fields" });
        }

        const parsedSizes = JSON.parse(sizes);
        
        const files = req.files || [];
        console.log("Uploaded Files:", req.files);
        // const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            files.map(async(file) => {
                const result = await cloudinary.uploader.upload(file.path, {resource_type:"image",});
                console.log("Uploaded:", result.secure_url);
                return result.secure_url;
            })
        );
        
        const productData = {
            name,
            description,
            category,
            MRP: Number(MRP),
            discount: Number(discount),
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: parsedSizes,
            image: imagesUrl,
            date: Date.now(),
            baseMetal,
            color,
            occasion,
            plating,
            stoneType,
            trend,
            publish: publish === "true" ? true : false
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({success:true, message:"Product Added"});
        
    } catch (error) {

        console.log(error);
        res.json({success:false, message:error.message});
        
    }

}

// function for lost product
const listProducts = async (req, res)  => {

    try {

        const products = await productModel.find({});
        res.json({success:true, products});
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }

}

// function for remove product
const removeProduct = async (req, res)  => {

    try {

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Product Removed"});
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }

}

// function for single product product info
const singleProduct = async (req, res)  => {

    try {

        const { productId } = req.body;
        const product = await productModel.findById(productId);
        console.log(product);
        res.json({success:true, product});
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }

}

const togglePublish = async (req, res) => {
    try {
        const {id, publish} = req.body;
        const updatedProduct = await productModel.findByIdAndUpdate(id, { publish });
        if(!updatedProduct){
            res.json({success: false, message:"Product not found"});
        }
        res.json({success:true, message: `Product is now ${publish ? 'Published' : 'Hidden'}`});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const updateQuantity = async (req, res) => {
    const {id, size, quantity} = req.body;
    console.log(req.body);
    try {
        const product = await productModel.findById(id);
        if(!product) return res.json({success: false, message: "Product Not Found"});

        product.sizes = product.sizes.map(s=>s.size === size ? {...s, quantity} : s);

        await product.save();

        res.json({success: true, message: "Quantity updated"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message});
    }
}

export {listProducts, addProduct, removeProduct, singleProduct, togglePublish, updateQuantity};

