import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import userAuth from '../middleware/auth.js'
import { getCoupons, createCoupons, couponValid, deleteCoupon } from '../controllers/couponController.js';

const couponRouter = express.Router();

couponRouter.get('/getCoupon', getCoupons);
couponRouter.post('/createCoupon', adminAuth, createCoupons);
couponRouter.get('/valid', couponValid);
couponRouter.delete('/delete/:id', adminAuth, deleteCoupon);

export default couponRouter;