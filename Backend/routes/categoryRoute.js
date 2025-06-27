import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {getCategories, createCategory, deleteCategory, addSubCategory, deleteSubCategory} from "../controllers/categoryControllers.js"

const categoryRouter = express.Router();

categoryRouter.get('/get', getCategories);
categoryRouter.post('/create', adminAuth, createCategory);
categoryRouter.delete('/delete/:id', adminAuth, deleteCategory);
categoryRouter.post('/add-subcategory/:id', adminAuth, addSubCategory);
categoryRouter.delete('/delete-subcategory/:id', adminAuth, deleteSubCategory);

export default categoryRouter;