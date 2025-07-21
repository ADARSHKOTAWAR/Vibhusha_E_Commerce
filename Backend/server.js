import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/Mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import couponRouter from './routes/couponRoute.js';
import imageRouter from './routes/imageRoute.js';

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/hero-images', imageRouter);

app.get('/', (req, res)=>{
    res.send("API Working");
})

app.listen(port, ()=> {
    console.log(`Server running on PORT: ${port}`); 
})