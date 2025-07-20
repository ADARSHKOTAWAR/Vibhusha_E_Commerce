import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { assets } from '../assets/frontend_assets/assets'

const Hero = () => {
  const navigate = useNavigate()

  const slides = [assets.home1, assets.home2, assets.home3]

  const handleRedirect = () => {
    navigate('/collection')
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        spaceBetween={10}
        className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] rounded-2xl overflow-hidden shadow-xl cursor-pointer"
        onClick={handleRedirect}
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Hero
