import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const AddOfflineOrder = ({ token }) => {
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [productQuantities, setProductQuantities] = useState({});

    useEffect(() => {
        axios.get(backendURL + '/api/product/list')
            .then(res => {
                setProducts(res.data.products);
                const initialQuantities = {};
                res.data.products.forEach(p => {
                    initialQuantities[p._id] = 1;
                });
                setProductQuantities(initialQuantities);
            });
    }, []);

    const handleQuantityChange = (productId, quantity) => {
        setProductQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, quantity)
        }));
    };

    const addProductToOrder = (productId) => {
        const product = products.find(p => p._id === productId);
        const quantity = productQuantities[productId];

        if (!product || quantity < 1) {
            toast.error("Please enter a valid quantity.");
            return;
        }

        const index = selectedItems.findIndex(item => item.productId === productId);

        if (index > -1) {
            const updated = [...selectedItems];
            updated[index].quantity += quantity;
            setSelectedItems(updated);
        } else {
            setSelectedItems([...selectedItems, {
                productId,
                name: product.name,
                quantity,
                price: product.price
            }]);
        }
        toast.success(`${product.name} added to order!`);
    };

    const removeProductFromOrder = (productId) => {
        setSelectedItems(selectedItems.filter(item => item.productId !== productId));
    };

    const updateSelectedItemQuantity = (productId, quantity) => {
        setSelectedItems(selectedItems.map(item =>
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const placeOrder = async () => {
        if (selectedItems.length === 0) return toast.error("Please add items to the order before placing.");

        try {
            const items = selectedItems.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                name: p.name,
                price: p.price
            }));

            const res = await axios.post(backendURL + '/api/order/offlineOrder', {
                items,
                amount: total,
                paymentMethod,
                payment: true,
                date: Date.now(),
                orderSource: 'offline',
                customerName,
                customerPhone
            }, { headers: { token } });

            if (res.data.success) {
                toast.success('Order placed successfully!');
                setSelectedItems([]);
                setCustomerName('');
                setCustomerPhone('');
                setPaymentMethod('cash');

                const initialQuantities = {};
                products.forEach(p => {
                    initialQuantities[p._id] = 1;
                });
                setProductQuantities(initialQuantities);
            } else {
                toast.error("Order Not Placed: " + res.data.message);
            }
        } catch (error) {
            toast.error("Order Not Placed. Please try again.");
        }
    };

    return (
        <div className='container mx-auto px-4 py-6'>
            <div className='bg-white rounded-xl shadow-md p-6 max-w-[1200px] mx-auto'>
                <h2 className='text-3xl font-bold text-center mb-8'>Create Offline Order</h2>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

                    {/* Product Section */}
                    <div className='max-h-[80vh] overflow-y-auto pr-2'>
                        <h3 className='text-xl font-semibold mb-4'>Available Products</h3>
                        <div className='space-y-4'>
                            {products.map(p => (
                                <div key={p._id} className='flex items-center bg-gray-50 border border-gray-300 rounded-md p-3 shadow-sm'>
                                    {p.images?.length > 0 && (
                                        <img
                                            src={p.images[0]}
                                            alt={p.name}
                                            className='w-16 h-16 object-cover rounded-md mr-4'
                                        />
                                    )}
                                    <div className='flex-1'>
                                        <div className='font-medium text-gray-800'>{p.name}</div>
                                        <div className='text-sm text-gray-500'>₹{p.price.toFixed(2)}</div>
                                    </div>
                                    <input
                                        type='number'
                                        min='1'
                                        value={productQuantities[p._id] || 1}
                                        onChange={(e) => handleQuantityChange(p._id, parseInt(e.target.value))}
                                        className='w-20 text-center border border-gray-300 rounded-md mx-2'
                                    />
                                    <button
                                        onClick={() => addProductToOrder(p._id)}
                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md'
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className='sticky top-6'>
                        <h3 className='text-xl font-semibold mb-4'>Order Summary</h3>
                        <div className='space-y-3'>
                            {selectedItems.length === 0 ? (
                                <p className='text-gray-500 italic'>No items added yet.</p>
                            ) : selectedItems.map(item => (
                                <div key={item.productId} className='flex items-center justify-between border border-gray-200 p-2 rounded-md bg-white'>
                                    <div className='flex-1'>
                                        <div className='font-medium text-gray-800'>{item.name}</div>
                                        <div className='text-sm text-gray-600'>
                                            ₹{item.price.toFixed(2)} x
                                            <input
                                                type='number'
                                                min='1'
                                                value={item.quantity}
                                                onChange={(e) => updateSelectedItemQuantity(item.productId, parseInt(e.target.value))}
                                                className='w-12 text-center mx-2 border border-gray-300 rounded-md'
                                            />
                                            = ₹{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeProductFromOrder(item.productId)}
                                        className='text-red-600 text-xl font-bold'
                                        title='Remove item'
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className='mt-6 space-y-4'>
                            <input
                                type='text'
                                placeholder='Customer Name'
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                className='w-full border border-gray-300 rounded-md p-3'
                            />
                            <input
                                type='tel'
                                placeholder='Phone Number'
                                value={customerPhone}
                                onChange={e => setCustomerPhone(e.target.value)}
                                className='w-full border border-gray-300 rounded-md p-3'
                            />
                            <select
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                                className='w-full border border-gray-300 rounded-md p-3 bg-white'
                            >
                                <option value='cash'>Cash</option>
                                <option value='upi'>UPI</option>
                                <option value='card'>Card</option>
                            </select>
                        </div>

                        <div className='flex justify-between items-center text-2xl font-bold text-gray-800 mt-6'>
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={placeOrder}
                            className='w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md shadow-lg transition duration-300 ease-in-out'
                        >
                            Place Offline Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOfflineOrder;
