import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>

        <Title text1={'About'} text2={'Us'} />

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className=' flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Welcome to Vibhusha, your destination for exquisite artificial jewelry. We believe everyone deserves beautiful pieces that express their unique style without compromising quality or affordability. Our passion is curating a diverse collection of meticulously crafted earrings, necklaces, bracelets, and rings, designed to add sparkle and sophistication to any occasion. We're committed to offering stunning, comfortable, and durable pieces you'll cherish for year
          </p>
          <p>
            At Vibhusha, we're more than a jewelry store; we're curators of confidence and expression. We understand the power of a well-chosen accessory to transform an outfit and elevate your mood. That's why we constantly bring you the latest trends alongside classic designs, all while maintaining high standards of craftsmanship and customer satisfaction. Explore our collection and discover the perfect pieces to celebrate life's moments with brilliant, affordable luxury.  
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>At Vibhusha, our mission is to empower individuals to express their unique style and enhance their confidence through high-quality, affordable artificial jewelry. We strive to offer a diverse and stunning collection that combines current trends with timeless elegance, ensuring every piece adds a touch of brilliance to life's special moments and everyday beauty. We're committed to exceptional craftsmanship and customer satisfaction, making beautiful adornment accessible to everyone.</p>
        </div>
      </div>

      <div className='text-2xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US?'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>At Vibhusha, we are dedicated to offering only the highest quality artificial jewelry. Each piece in our collection undergoes rigorous quality checks to ensure it meets our exacting standards for craftsmanship, durability, and finish. We believe in providing you with stunning accessories that not only look exquisite but also stand the test of time.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Shopping for beautiful jewelry should be a joy, not a chore. Vibhusha offers you the ultimate in convenience with our user-friendly online store, secure payment options, and efficient delivery right to your doorstep. Browse our extensive collection anytime, anywhere, and discover your next favorite piece with ease.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Your satisfaction is our top priority at Vibhusha. Our dedicated customer service team is always ready to assist you, whether you have a question about a product, need help with an order, or simply want style advice. We're committed to providing a seamless and delightful shopping experience from start to finish.</p>
        </div>
      </div>

      <NewsLetterBox />

    </div>
  )
}

export default About 