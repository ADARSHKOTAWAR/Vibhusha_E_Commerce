import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='my-10 mt-40 text-sm'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14'>
        {/* Left section */}
        <div>
          <img src={assets.logo} className='mb-5 w-40' alt="Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Vibhusha offers a stunning collection of artificial jewelry, blending tradition with modern elegance. Our pieces are designed to enhance your beauty on every occasion.
          </p>
        </div>

        {/* Company section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <NavLink to='/'><li>Home</li></NavLink>
            <NavLink to='/about'><li>About Us</li></NavLink>
            <NavLink to='/collection'><li>Collection</li></NavLink>
            <NavLink to='/contact'><li>Contact</li></NavLink>
          </ul>
        </div>

        {/* Contact section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>+91 9421785404</li>
            <li>contact@vibhusha.co.in</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <hr className='my-6 border-gray-300' />
      <p className='text-sm text-center text-gray-500 pb-4'>
        &copy; www.vibhusha.co.in - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
