import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL } from '../../../admin/src/App';
import { assets } from '../assets/frontend_assets/assets';

const ApplyCoupon = ({ cartItems, cartTotal, user, setDiscount, setAppliedCoupon, token, appliedCoupon, discount }) => {

  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!couponCode.trim()) return toast.error('Enter a coupon code');

    setLoading(true);

    try {
      const res = await axios.get(`${backendURL}/api/coupon/valid`, {
        params: {
          code: couponCode,
          userId: user?._id,
          cartTotal,
          cartItems: JSON.stringify(cartItems)
        },
        headers: { token }
      });

      if (res.data.success) {
        const coupon = res.data.coupon;

        let discountAmount = 0;
        if (coupon.discountType === 'percent') {
          discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
          discountAmount = coupon.discountValue;
        }

        localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
        localStorage.setItem('discountAmount', discountAmount);

        setDiscount(discountAmount);
        setAppliedCoupon(coupon);
        toast.success(`Coupon Applied! You Saved ₹${discountAmount.toFixed(2)}`);
      }
      else {
        console.log(res.data);
        toast.error('Coupon Not Applied!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    const savedDiscount = localStorage.getItem('discountAmount');

    if (savedCoupon && savedDiscount) {
      setAppliedCoupon(JSON.parse(savedCoupon));
      setDiscount(Number(savedDiscount));
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto border border-gray-300 shadow-sm rounded-2xl p-5 bg-white">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Have a Coupon?</h3>

      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          disabled={!!appliedCoupon}
        />

        <button
          onClick={handleApply}
          type="button"
          disabled={loading || appliedCoupon}
          className={`px-5 py-2 rounded-lg font-medium transition-colors duration-200 ${loading || appliedCoupon
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-900'
            }`}
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>

      {appliedCoupon && (
        <div className="mt-4 px-3 py-2 bg-green-50 border border-green-300 rounded-lg flex justify-between items-center">
          <span className="text-green-700 text-sm">
            Applied Coupon: <b>{appliedCoupon.code}</b>
          </span>

          <button
            onClick={() => {
              localStorage.removeItem("appliedCoupon");
              localStorage.removeItem("discountAmount");
              setAppliedCoupon(null);
              setDiscount(0);
              setCouponCode('');
              toast.info("Coupon removed");
            }}
            className="ml-4 text-red-600 underline text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </div>

  );
};

export default ApplyCoupon;
