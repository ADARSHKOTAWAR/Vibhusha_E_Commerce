import couponModel from "../models/couponModel.js";
import productModel from '../models/productModel.js';

const getCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const createCoupons = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      appliesTo,
      specificValue,
      minCartValue,
      userId,
      usageType,
      usageLimit,
      expiryDate,
      published,
    } = req.body;

    const existing = await couponModel.findOne({ code });
    if (existing)
      return res.json({
        success: false,
        message: "Coupon code already exists",
      });

    if (!code || !discountType || !discountValue)
      return res.json({ success: false, message: "Missing requires Fields" });

    const newCoupon = new couponModel({
      code,
      description,
      discountType,
      discountValue,
      appliesTo: "all",
      specificValue,
      minCartValue,
      ...(userId ? { userId } : {}),
      usageType,
      usageLimit,
      expiryDate: new Date(expiryDate),
      published,
    });

    await newCoupon.save();
    res.json({ success: true, message: "Coupon created Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// const extractCartItemsArray = (cartItems, allProducts) => {
//   const result = [];

//   for (const productId in cartItems) {
//     const product = allProducts.find(p => p._id === productId || p._id.toString() === productId);
//     if (!product) continue;

//     for (const size in cartItems[productId]) {
//       const quantity = cartItems[productId][size];
//       if (quantity > 0) {
//         result.push({
//           productId,
//           size,
//           quantity,
//           category: product.category,
//           subcategory: product.subcategory,
//         });
//       }
//     }
//   }

//   return result;
// };

const deleteCoupon = async ( req, res ) => {
  try {
    const { id } = req.params;

    const deleted = await couponModel.findByIdAndDelete(id);

    if(!deleted) {
      return res.json({ success: false, message: "Coupon not Found" });
    }
    res.json({success: true, message: "Coupon deleted successfully"});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Failed to delete coupon' });
  }
};

const couponValid = async (req, res) => {
  const { code, userId, cartItems = [], cartTotal = 0 } = req.query;

  try {
    const coupon = await couponModel.findOne({
      code: code.toUpperCase(),
      published: true,
    });

    if (!coupon)
      return res.json({ success: false, message: "Coupon not found" });

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.json({ success: false, message: "Coupon Expired!" });
    }

    if (
      coupon.usageType === "limited" &&
      coupon.usageCount >= coupon.usageLimit
    ) {
      return res.json({
        success: false,
        message: "Coupon usage limit exceeded!",
      });
    }

    let isValid = false;

    console.log(cartItems);

    // const flatItems = extractCartItemsArray(cartItems, productModel);

    switch (coupon.appliesTo) {
      case "all":
        isValid = true;
        break;
      case "product":
        isValid = flatItems.some(
          (item) => item.productId === coupon.specificValue
        );
        break;
      case "category":
        isValid = flatItems.some(
          (item) => item.category === coupon.specificValue
        );
        break;
      case "subcategory":
        isValid = flatItems.some(
          (item) => item.subcategory === coupon.specificValue
        );
        break;
      case "user":
        isValid = userId === coupon.userId?.toString();
        break;
    }

    if (!isValid)
      return res.json({
        success: false,
        message: "Coupon not applicable to this cart",
      });

    res.json({ success: true, coupon });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};

export { getCoupons, createCoupons, couponValid, deleteCoupon };
