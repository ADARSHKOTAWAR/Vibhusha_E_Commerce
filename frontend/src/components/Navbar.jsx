import React, { useState, useContext } from 'react';
import { assets } from "../assets/frontend_assets/assets";
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} =useContext(ShopContext);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    setToken('');
    setCartItems({});
  }

  // Placeholder cart count (replace with actual state/prop if needed)
  const cartCount = 2;

  return (
    <div className='flex items-center justify-between py-5 px-4 font-medium relative'>
      
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} className='w-45' alt="Logo" />
      </Link>

      {/* Navigation Links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-black font-semibold' : ''}`
          }
        >
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/collection'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-black font-semibold' : ''}`
          }
        >
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/about'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-black font-semibold' : ''}`
          }
        >
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

        <NavLink
          to='/contact'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-black font-semibold' : ''}`
          }
        >
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      {/* Icons */}
      <div className='flex items-center gap-6'>
        <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className="w-5 cursor-pointer" alt="Search" />

        {/* Profile Dropdown */}
        <div className='group relative'>
          <img onClick={()=> token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="Profile" />
          {/* Dropdown Menu */}
          {token && <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 transition duration-300 ease-in-out'>
            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow'>
              <p className='cursor-pointer hover:text-black'>My Profile</p>
              <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
              <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
            </div>
          </div>
          }
        </div>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="Cart" />
          {cartCount > 0 && (
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
              {getCartCount()}
            </p>
          )}
        </Link>

        {/* Mobile Menu Icon */}
        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="Menu" />
      </div>

      {/* Mobile Drawer */}
    <div className={`fixed top-0 right-0 h-full bg-white z-50 transition-all duration-300 ease-in-out ${visible ? 'w-72 px-5 py-6' : 'w-0 px-0 py-0 overflow-hidden'}`}>
      <div className='flex flex-col text-gray-600'>
      {/* Close Button */}
       <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
       <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="Back" />
       <p>Back</p>
       </div>

         {/* Nav Items */}
        <NavLink to="/" onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200">HOME</NavLink>
        <NavLink to="/collection" onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200">COLLECTION</NavLink>
        <NavLink to="/about" onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200">ABOUT</NavLink>
        <NavLink to="/contact" onClick={() => setVisible(false)} className="py-3 pl-6 border-b border-gray-200">CONTACT</NavLink>
    </div>
</div>

    </div>
  );
};

export default Navbar;
