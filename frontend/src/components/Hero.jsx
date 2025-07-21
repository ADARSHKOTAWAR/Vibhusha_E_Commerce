import React, { useState, useEffect, useContext } from 'react'; // Import useState and useEffect
import {ShopContext} from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios'; // Import axios for API calls
import { assets } from '../assets/frontend_assets/assets'; // Keep if you have fallback images or other assets

const Hero = () => {
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState([]); // State to store hero images fetched from DB
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const {backendURL} = useContext(ShopContext);

  // Function to fetch hero images from the backend
  const fetchHeroImages = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(`${backendURL}/api/hero-images/list`);
      if (response.data.success) {
        setHeroImages(response.data.images); // Update state with fetched images
      } else {
        console.error('Failed to fetch hero images:', response.data.message);
        // Optionally, show a toast notification here if react-toastify is available
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Optionally, show a toast notification here
    } finally {
      setIsLoading(false); // Set loading to false after fetching (success or failure)
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchHeroImages();
  }, []); // Empty dependency array means this runs once on mount

  const handleRedirect = () => {
    navigate('/collection');
  };

  // Fallback slides in case no images are loaded from the backend
  const defaultSlides = [assets.home1, assets.home2, assets.home3];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-4">
      {isLoading ? (
        // Display a loading indicator while images are being fetched
        <div className="flex items-center justify-center h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] rounded-2xl bg-gray-200 text-gray-600 text-lg font-semibold">
          Loading Hero Images...
        </div>
      ) : (
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
          {/* Use heroImages from state if available, otherwise use default slides */}
          {(heroImages.length > 0 ? heroImages : defaultSlides).map((item, index) => (
            <SwiperSlide key={item._id || index}> {/* Use _id for unique key if from DB, otherwise index */}
              <img
                src={item.url || item} // Use item.url if from DB, otherwise item directly (for default slides)
                alt={item.alt || `slide-${index}`} // Use item.alt if from DB, otherwise a generic alt
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Hero;
