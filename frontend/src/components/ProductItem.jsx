import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price, discount, MRP }) => {
  const { currency, addToCart } = useContext(ShopContext)

  return (
    <div className="text-gray-700 cursor-pointer p-2 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Product Link */}
      <Link to={`/product/${id}`}>
        <div className="relative overflow-hidden rounded-lg">
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
              {discount}% OFF
            </div>
          )}

          {/* Product Image */}
          <img
            className="hover:scale-110 transition-transform duration-300 ease-in-out w-full h-auto"
            src={image[0]}
            alt={name}
          />
        </div>

        {/* Product Info */}
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <div className="text-sm">
          <span className="font-semibold text-black">{currency}{price}</span>
          {MRP && (
            <span className="line-through text-gray-500 ml-2">{currency}{MRP}</span>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <button
        onClick={() => addToCart(id)}
        className="mt-3 w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-800 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductItem
