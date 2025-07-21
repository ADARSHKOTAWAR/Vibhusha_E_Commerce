import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL, currency } from "../App"; // Assuming backendURL and currency are defined in App.js
import { toast } from 'react-toastify'; // For displaying notifications
import { assets } from '../assets/admin_assets/assets'; // Assuming parcel_icon is here

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]); // State to store the list of orders

  const deleteOrder = async (id) => {

    try {
      const response = await axios.post(backendURL + '/api/order/delete', {id}, { headers: {token} });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // Function to fetch all orders from the backend
  const fetchAllOrders = async () => {
    if (!token) {
      // If no token is available, cannot fetch orders
      console.error("Authentication token is missing.");
      return null;
    }

    try {
      // Make a POST request to the backend to get the list of orders
      const response = await axios.post(backendURL + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        // If the request is successful, update the orders state
        setOrders(response.data.orders);
      } else {
        // If there's an error from the backend, show a toast notification
        toast.error(response.data.message);
      }
    } catch (error) {
      // Catch any network or other errors and log them, then show a toast
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders: " + error.message);
    }
  };

  // Function to handle status updates for an order
  const statusHandler = async (event, orderId) => {
    try {
      // Make a POST request to update the order status
      const response = await axios.post(backendURL + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } });
      if (response.data.success) {
        // If successful, re-fetch all orders to update the UI
        await fetchAllOrders();
        toast.success("Order status updated successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status: " + error.message);
    }
  };

  // useEffect hook to fetch orders when the component mounts or token changes
  useEffect(() => {
    fetchAllOrders();
  }, [token]); // Dependency array includes token, so it re-runs if token changes


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h3 className="text-2xl font-bold my-4 text-gray-800">Order Page</h3>

      <div>
        {/* Conditional rendering based on whether orders exist */}
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_0.5fr_0.5fr] gap-3 items-start border-2 border-gray-200 rounded-lg p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 shadow-md' key={index}>
              {/* Parcel Icon */}
              <img className='w-12 mx-auto sm:mx-0' src={assets.parcel_icon} alt="Parcel Icon" />

              {/* Order Items and Customer/Address Details */}
              <div>
                <h4 className="font-semibold text-base mb-2">Order Details:</h4>
                {
                  Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => (
                      <p className='py-0.5' key={itemIndex}>
                        <span className="font-medium">{item.name}</span> x {item.quantity}
                        {item.size && <span className="text-gray-500"> ({item.size})</span>}
                        {itemIndex !== order.items.length - 1 && <span className="text-gray-400">,</span>}
                      </p>
                    ))
                  ) : (
                    <p className='text-red-500 italic'>No items found for this order.</p>
                  )
                }

                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <h4 className="font-semibold text-base mb-2">Customer Info:</h4>
                  {order.orderSource === 'offline' ? (
                    <>
                      <p className='font-medium text-gray-800'>Customer: {order.customerName || 'N/A'}</p>
                      <p>Phone: {order.customerPhone || "N/A"}</p>
                    </>
                  ) : (
                    order.address && (
                      <>
                        <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
                        <p className='text-sm sm:text-[15px]'>{order.address.street},</p>
                        <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                        <p>{order.address.phone}</p>
                      </>
                    )
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <p className="font-semibold">Items: <span className="font-normal">{order.items.length}</span></p>
                <p className="font-semibold">Method: <span className="font-normal">{order.paymentMethod}</span></p>
                <p className="font-semibold">Payment: <span className={`font-normal ${order.payment ? 'text-green-600' : 'text-red-500'}`}>{order.payment ? 'Done' : 'Pending'}</span></p>
                <p className="font-semibold">Date: <span className="font-normal">{new Date(order.date).toDateString()}</span></p>
                <p className='text-xs mt-2'>
                  <span className={`px-2 py-1 rounded text-white font-medium ${order.orderSource === 'offline' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                    {order.orderSource.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* Order Amount */}
              <p className='text-lg sm:text-xl font-bold text-green-700'>{currency}{order.amount}</p>

              {/* Status Dropdown */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="offline order">Offline Order</option>
              </select>

              {/* Delete Button */}
              <button
                onClick={() => deleteOrder(order._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Delete Order"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg mt-8">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
