import express from 'express';
import  multer from 'multer'; 
import adminAuth from '../middleware/adminAuth.js';
import { addImage, deleteImage, listImages } from '../controllers/imageController.js';

const imageRouter = express.Router(); 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.post('/add', adminAuth, upload.single('image'), addImage);
imageRouter.delete('/remove/:id', adminAuth, deleteImage);
imageRouter.get('/list', listImages);

export default imageRouter;