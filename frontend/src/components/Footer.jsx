import React from 'react';
import { assets } from '../assets/frontend_assets/assets';

const Footer = () => {
  return (
    <footer className='my-10 mt-40 text-sm'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14'>
        {/* Left section */}
        <div>
          <img src={assets.logo} className='mb-5 w-40' alt="Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse repudiandae quo saepe ex voluptatum, est soluta ducimus nulla, veniam qui, officia molestias eius nihil veritatis itaque eligendi! Velit, earum voluptate.
          </p>
        </div>

        {/* Company section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
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
        &copy; 2024 forever.com - All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
