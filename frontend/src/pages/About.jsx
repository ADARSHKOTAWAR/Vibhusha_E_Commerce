import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>

        <Title text1={'About'} text2={'Us'}/>

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className=' flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor recusandae consequuntur deserunt ad voluptatum, vitae, odio ullam eaque sunt ratione eveniet. Rem, laborum pariatur similique voluptatem illum sed dolores ea?</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ullam culpa nisi quisquam veniam quae ab qui vero? Rem laudantium sequi, suscipit doloribus eaque aliquam. In natus perferendis officia sapiente.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illo excepturi suscipit in neque magnam hic rem incidunt facere aliquam ratione placeat ab fugiat nostrum mollitia doloribus harum rerum, vero soluta.</p>
        </div>
      </div>

      <div className='text-2xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US?'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus ex, ab eaque atque similique aliquid molestiae, tempora architecto dignissimos enim velit mollitia minus repellendus iusto quas qui laudantium, corrupti alias?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus ex, ab eaque atque similique aliquid molestiae, tempora architecto dignissimos enim velit mollitia minus repellendus iusto quas qui laudantium, corrupti alias?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ducimus ex, ab eaque atque similique aliquid molestiae, tempora architecto dignissimos enim velit mollitia minus repellendus iusto quas qui laudantium, corrupti alias?</p>
        </div>
      </div>

        <NewsLetterBox/>

    </div>
  )
}

export default About 