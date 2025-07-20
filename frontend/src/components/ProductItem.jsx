import React from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, discount, MRP }) => {
  return (
    <div className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer text-[#4b3a2f]">
      {/* Product Link */}
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden rounded-xl">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-[#F76C5E] text-white text-xs px-2 py-1 rounded-full shadow">
              {discount}% OFF
            </div>
          )}

          {/* Product Image */}
          <img
            className="hover:scale-105 transition-transform duration-300 ease-in-out w-full h-[210px] object-contain rounded-xl"
            src={image[0]}
            alt={name}
          />
        </div>

        {/* Product Info */}
        <div className="mt-4 px-1">
          <p className="text-sm font-medium line-clamp-2">{name}</p>
          <div className="text-base mt-1">
            <span className="font-semibold text-[#7A4F24]">₹{price}</span>
            {MRP && (
              <span className="line-through text-gray-400 ml-2 text-sm">₹{MRP}</span>
            )}
          </div>
        </div>
      </Link>

      {/* View Product Button */}
      <Link to={`/product/${id}`}>
        <button className="mt-3 w-full border border-[#7A4F24] text-[#7A4F24] hover:bg-[#7A4F24] hover:text-white transition-all text-sm py-2 rounded-full font-medium">
          View Product
        </button>
      </Link>
    </div>
  );
};

export default ProductItem;
