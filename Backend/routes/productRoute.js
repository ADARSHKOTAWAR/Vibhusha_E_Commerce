import express from "express"
import {listProducts, addProduct, removeProduct, singleProduct, togglePublish, updateQuantity} from "../controllers/productController.js"
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.array("images", 12) ,addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);
productRouter.put('/toggle-publish', adminAuth, togglePublish);
productRouter.put('/update-quantity', adminAuth ,updateQuantity);

export default productRouter