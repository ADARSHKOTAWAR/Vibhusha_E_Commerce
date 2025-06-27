import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL, currency } from "../App";
import { toast } from 'react-toastify';
import { assets } from '../assets/admin_assets/assets';

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendURL + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }

  const statusHandler = async (event, orderId) => {

    try {
      const response = await axios.post(backendURL + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        await fetchAllOrders();
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }

  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);


  return (
    <div>
      <h3 className="text-xl font-bold my-4">Order Page</h3>

      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                {
                  Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => {
                      return (
                        <p className='py-0.5' key={index}>
                          {item.name} x {item.quantity}
                          {item.size && <span> ({item.size})</span>}
                          {index !== order.items.length - 1 && ','}
                        </p>
                      );
                    })
                  ) : (
                    <p className='text-red-500 italic'>No items found</p>
                  )
                }

                <div className='mt-3'>
                  {order.orderSource === 'offline' ? (
                    <>
                      <p className='font-medium text-gray-800'> Customer: {order.customerName || 'N/A'} </p>
                      <p>Phone: {order.customerPhone || "N/A"}</p>
                    </>) : (
                    order.address && (
                      <>
                        <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
                        <p className='text-sm sm:text-[15px]'>{order.address.street},</p>
                        <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                        <p>{order.address.phone}</p>
                      </>
                    ))}
                </div>
              </div>

              <div>
                <p>Items : {order.items.length}</p>
                <p>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'} </p>
                <p>Date : {new Date(order.date).toDateString()}</p>
                <p className='text-xs mt-2'><span className={`px-2 py-1 rounded text-white ${order.orderSource === 'offline' ? 'bg-orange-500' : 'bg-blue-500'}`}>  {order.orderSource.toUpperCase()} </span></p>
              </div>
              <p className='text-sm sm:text-[15px] font-bold'>{currency}{order.amount}</p>

              <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="offline order">Offline Order</option>
              </select>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Orders;