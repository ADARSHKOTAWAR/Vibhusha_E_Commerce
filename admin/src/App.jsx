import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import Category from './pages/Category'
import Coupons from './pages/Coupons'
import AddOfflineOrder from './pages/AddOfflineOrder'
import AdminHeroImages from './pages/AdminHeroImages'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export const backendURL = import.meta.env.VITE_BACKEND_URL;
export const currency  = "₹";

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token'): '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === ""
        ? <Login setToken={setToken} />
        :
        <>
          <Navbar setToken={setToken}/>
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token}/>} />
                <Route path='/list' element={<List token={token}/>} />
                <Route path='/orders' element={<Orders token={token}/>} />
                <Route path='/category' element={<Category token={token}/>} />
                <Route path='/coupon' element={<Coupons token={token}/>} />
                <Route path='/offlineOrder' element={<AddOfflineOrder token={token}/>} />
                <Route path='/addImage' element={<AdminHeroImages token={token}/>} />
              </Routes>
            </div>
          </div>

        </>

      }

    </div>
  )
}

export default App