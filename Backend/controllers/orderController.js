import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"

// Placing orders using COD Method

const placeOrder = async (req, res) => {
    try {
        
        const { userId, items, amount, address } = req.body;

        for (const item of items){
            const { _id, size, quantity} = item;

            const product = await productModel.findById(_id);
            if(!product){
                return res.json({success:false, message:"Product Not Found"});
            }
            
            console.log(product);

            const sizeObj = product.sizes.find(s => s.size === size);

            if (!sizeObj) {
                return res.json({success: false, message: "Size ${size} not found for product ${product.name}"});
            }

            console.log(sizeObj);

            if( sizeObj.quantity < quantity ){
                return res.json({ success:false, message: `Only ${sizeObj.quantity} items available for size ${size} of ${product.name}` });
            }

            await productModel.updateOne(
                {_id, "sizes.size": size},
                {$inc: {"sizes.$.quantity": -quantity}}
            );
        }

        const orderData = {
            userId, 
            items, 
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);

        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {cartData:{}});

        res.json({success: true, message:"Order Placed Successfully!!"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

// Placing Orders using Stripe Method

const placeOrderStripe = async (req, res) => {

}

// Placing Orders using Razorpay Method

const placeOrderRazorpay = async (req, res) => {

}

// All orders data for admin panel
const allOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({});
        res.json({success:true, orders});
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }

}

// User Order data for frontend
const userOrders = async (req, res) => {

    try {

        const { userId } = req.body;

        const orders = await orderModel.find({ userId });

        res.json({success:true, orders});
         
    } catch (error) {

        console.log(error);
        res.json({success:false, message:error.message});
        
    }

}

// const updateQuantity = async (req, res) => {
//     try {

//         const { items, address, amount } = req.body;

//         for (const item of items){
//             const { _id, size, quantity} = item;

//             const product = await productModel.findById(_id);
//             if(!product){
//                 return res.json({success:false, message:"Product Not Found"});
//             }

//             const sizeObj = product.sizes.find(s => s.size === size);

//             if (!sizeObj) {
//                 return res.json({success: false, message: "Size ${size} not found for product ${product.name}"});
//             }
//             if( sizeObj.quantity < quantity ){
//                 return res.json({ success:false, message: `Only ${sizeObj.quantity} items available for size ${size} of ${product.name}` });
//             }

//             await productModel.updateOne(
//                 {_id, "sizes.size": size},
//                 {$inc: {"sizes.$.quantity": -quantity}}
//             );
//         }

//         return res.json({success: true, message: "Prder Placed Successfully"});
        
//     } catch (error) {
//         console.error(error);
//         return res.json({success: false, message: error.message});
//     }
// }

// update order status from admin panel

const placeOfflineOrder = async (req, res) => {

    try {
        const { items, amount, paymentMethod, customerName, customerPhone } = req.body;

        if( !items || items.length == 0 || !amount || !paymentMethod ){
            return res.json({ success: false, message: "Missing Required Fields" });
        }

        const order = await orderModel.create({
            items, 
            amount,
            status: "offline order",
            paymentMethod: paymentMethod,
            payment: true,
            date: Date.now(),
            orderSource: "offline",
            customerName,
            customerPhone
        });

        return res.json({ success: 'true', order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

const updateStatus = async (req, res) => {

    try {

        const {orderId, status} = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({success:true, message:'Status Updated'});
        
    } catch (error) {

        console.log(error);
        res.json({success:false, message:error.message});
        
    }

}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, placeOfflineOrder};


