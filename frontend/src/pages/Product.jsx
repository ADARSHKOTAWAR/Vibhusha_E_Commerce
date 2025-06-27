import React, {useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import PublishedCoupons from '../components/PublishedCoupons';

const Product = () => {

    const {productId} = useParams();
    const {products, currency, addToCart} = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState();
    const [size, setSize] = useState('');
    const [details, setDetails] = useState("details");
    
    const fetchProductData = async () => {
      products.map((item)=>{
        if (item._id === productId ){
            setProductData(item);
            setImage(item.image[0]);
            return null;
        }
      })
    }

    useEffect(()=>{
      fetchProductData()
    },[productId, products])

  return productData ? (
    <div className='border-t-2 pt-10 transition-opticity ease-in duration-500 opticity-100'>
        {/* Product Data */}
        <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

          {/* Product Image */}
          <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          {/* Thumbnail List with scroll if >4 images */}
          <div className={`flex sm:flex-col overflow-x-auto sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full ${productData.image.length > 4 ? 'max-h-[550px] sm:overflow-y-scroll' : ''}`}>
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border hover:border-orange-500 transition'
                alt=""
              />
            ))}
          </div>

          {/* Main Image */}
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto rounded-md' alt="" />
          </div>
        </div>

          {/* Product Info */}
          <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="star" className="w-3.5" />
            <img src={assets.star_icon} alt="star" className="w-3.5" />
            <img src={assets.star_icon} alt="star" className="w-3.5" />
            <img src={assets.star_icon} alt="star" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="star dull" className="w-3.5" />
            <p className="pl-2 text-sm text-gray-600">(122)</p>
          </div>

          {/* Price + MRP + Discount */}
          <div className='mt-5 flex items-center gap-3'>
            <p className='text-3xl font-medium'>{currency}{productData.price}</p>
            {productData.MRP && (
              <p className='text-lg text-gray-500 line-through'>{currency}{productData.MRP}</p>
            )}
            {productData.discount > 0 && (
              <p className='text-lg font-bold text-green-600'>{productData.discount}% OFF</p>
            )}
          </div>

          {/* Description */}
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

           <div className='m-5'>
            <PublishedCoupons  /> 
           </div>
          {/* Size Selector */}
          <div className='flex flex-col gap-4 my-8'>
            <p>Select Size</p>
            <div className='flex gap-2 flex-wrap'>
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => { setSize(item.size) }}
                  className={`border py-2 px-4 bg-gray-100 ${item.size === size ? 'border-orange-500 font-semibold' : ''}`}
                  key={index}
                >
                  {item.size}
                </button>
              ))}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => addToCart(productData._id, size)}
              className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-gray-800 transition'
            >
              ADD TO CART
            </button>

            <hr className='mt-8 sm:w-4/5' />

            {/* Extra Info */}
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original Product.</p>
              <p>Cash on Delivery is available on this product.</p>
              <p>Easy Return and exchange policy within 7 days.</p>
            </div>
          </div>
        </div>

         

                  

        </div>
         {/* Description and Review Section */}
        <div className='mt-20'>
          <div className='flex'>
            <b className='border px-5 py-3 text-sm' onClick={() => setDetails('details')}>Details</b>
            <p className='border px-5 py-3 text-sm' onClick={() => setDetails('shipping')}>Shipping</p>
          </div>
          {
            (details === "details") ?
            <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
            <p>Product Name: {productData.name}</p>
            <p>Product Description: {productData.description}</p>
            <p>Product Category: {productData.category}   Product Subcategory: {productData.subCategory}</p>
            <p>Product Color: {productData.color}   {productData.trend ? "Trend: {productData.trend}" : ""}  {productData.occasion ? "Occasion: {productData.occasion}" : ""}</p>
            <p>{productData.stoneType ? "Trend: {productData.stoneType}" : ""}   {productData.baseMetal ? "Trend: {productData.baseMetal}" : ""}  {productData.plating ? "Trend: {productData.plating}" : ""}</p>
            
          </div> :
          <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
            <ul>Dispatch in 1-3 business days.</ul>
            <ul>Prepaid Orders (India) Delivery time: 2-4 business days.</ul>
            <ul>COD Orders (India) Delivery time: 5-8 business days.</ul>
            <ul>International Order Delivery: 5-8 business days.</ul>            
          </div>

          }
        </div>   

        {/* Display Related Products */}
        <RelatedProducts category={productData.category} subCategory={productData.subCategory}/>


    </div>
  ) : <div className='opticity-0'></div>
}

export default Product;