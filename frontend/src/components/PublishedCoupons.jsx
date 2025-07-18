import React, { useEffect, useState , useContext} from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';

const PublishedCouponsSlider = () => {
  const [coupons, setCoupons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const {backendURL} = useContext(ShopContext);

  const fetchPublishedCoupons = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/coupon/getCoupon`);
      setCoupons(res.data.coupons);
    } catch (err) {
      console.error("Error fetching coupons", err);
    }
  };

  useEffect(() => {
    fetchPublishedCoupons();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % coupons.length);
    }, 5000); // Change every 5 sec
    return () => clearInterval(interval);
  }, [coupons]);

  if (coupons.length === 0) return null;

  const current = coupons[currentIndex];

  const formatDiscountText = (coupon) => {
    if (coupon.appliesTo === "cartTotal" && coupon.minCartValue) {
      return `${coupon.discountType === 'amount' ? `Flat ₹${coupon.discountValue}` : `${coupon.discountValue}%`} off on shopping of ₹${coupon.minCartValue}`;
    } else {
      return `${coupon.discountType === 'amount' ? `Flat ₹${coupon.discountValue}` : `${coupon.discountValue}%`} off for applicable orders`;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-black rounded-xl overflow-hidden">
      {/* Title Bar */}
      <div className="bg-black text-white py-2 px-2 flex items-center gap-2">
        <img src={assets.discount} alt="discount" className="h-10 w-10 object-contain" />
        <span className="font-semibold text-md">Available Offers</span>
      </div>

      {/* Offer Text */}
      <div className="text-center py-4 px-6 bg-white text-black">
        <p className="text-base font-medium">
          <span className="font-bold">{formatDiscountText(current)}</span>
          {' '}| Use Code: <span className="font-semibold">{current.code}</span>
        </p>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center pb-4 gap-2">
        {coupons.map((_, idx) => (
          <div key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${idx === currentIndex ? 'bg-black w-4' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PublishedCouponsSlider;
