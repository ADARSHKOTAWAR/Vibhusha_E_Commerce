import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import PublishedCoupons from '../components/PublishedCoupons';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [details, setDetails] = useState('details');

  const fetchProductData = () => {
    const foundProduct = products.find(item => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image[0]);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t pt-10 transition-opacity duration-500 opacity-100">

      {/* PRODUCT DISPLAY SECTION */}
      <div className="flex flex-col sm:flex-row gap-12">
        
        {/* LEFT: IMAGE SECTION */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          
          {/* Thumbnail Images */}
          <div className={`flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:w-[18%] w-full ${productData.image.length > 4 ? 'max-h-[550px] sm:overflow-y-scroll' : ''}`}>
            {productData.image.map((img, idx) => (
              <img
                key={idx}
                onClick={() => setImage(img)}
                src={img}
                alt=""
                className="w-[24%] sm:w-full sm:mb-3 cursor-pointer border hover:border-orange-500 transition"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="w-full sm:w-[82%]">
            <img src={image} alt={productData.name} className="w-full h-auto rounded-md" />
          </div>

        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="flex-1">
          
          {/* Title */}
          <h1 className="text-2xl font-medium mt-2">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => <img key={i} src={assets.star_icon} className="w-3.5" alt="star" />)}
            <img src={assets.star_dull_icon} className="w-3.5" alt="star dull" />
            <p className="pl-2 text-sm text-gray-600">(122)</p>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-3xl font-medium">{currency}{productData.price}</p>
            {productData.MRP && <p className="line-through text-lg text-gray-500">{currency}{productData.MRP}</p>}
            {productData.discount > 0 && <p className="text-lg font-bold text-green-600">{productData.discount}% OFF</p>}
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.description}</p>

          {/* Coupons */}
          <div className="mt-5">
            <PublishedCoupons />
          </div>

          {/* Size Selection */}
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSize(item.size)}
                  className={`border py-2 px-4 bg-gray-100 ${item.size === size ? 'border-orange-500 font-semibold' : ''}`}
                >
                  {item.size}
                </button>
              ))}
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 active:bg-gray-700 transition"
            >
              ADD TO CART
            </button>

            <hr className="mt-8 sm:w-4/5" />

            {/* Extra Info */}
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original Product.</p>
              <p>Cash on Delivery is available on this product.</p>
              <p>Easy Return and exchange policy within 7 days.</p>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILS/SHIPPING TABS */}
      <div className="mt-20">
        <div className="flex">
          <button onClick={() => setDetails('details')} className={`border px-5 py-3 text-sm ${details === 'details' ? 'font-semibold' : ''}`}>Details</button>
          <button onClick={() => setDetails('shipping')} className={`border px-5 py-3 text-sm ${details === 'shipping' ? 'font-semibold' : ''}`}>Shipping</button>
        </div>

        {/* TAB CONTENT */}
        {details === 'details' ? (
          <div className="border px-6 py-6 text-sm text-gray-500 flex flex-col gap-4">
            <p>Product Name: {productData.name}</p>
            <p>Product Description: {productData.description}</p>
            <p>Category: {productData.category} | Subcategory: {productData.subCategory}</p>
            <p>Color: {productData.color}</p>
            {productData.trend && <p>Trend: {productData.trend}</p>}
            {productData.occasion && <p>Occasion: {productData.occasion}</p>}
            {productData.stoneType && <p>Stone Type: {productData.stoneType}</p>}
            {productData.baseMetal && <p>Base Metal: {productData.baseMetal}</p>}
            {productData.plating && <p>Plating: {productData.plating}</p>}
          </div>
        ) : (
          <div className="border px-6 py-6 text-sm text-gray-500 flex flex-col gap-4">
            <ul>Dispatch in 1-3 business days.</ul>
            <ul>Prepaid Orders (India): 2-4 business days.</ul>
            <ul>COD Orders (India): 5-8 business days.</ul>
            <ul>International Orders: 5-8 business days.</ul>
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      <div className="mt-16">
        <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
