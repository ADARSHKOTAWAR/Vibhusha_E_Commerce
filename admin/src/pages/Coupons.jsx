import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const Coupons = ({ token }) => {

    const [coupons, setCoupons] = useState([]);

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: '',
        appliesTo: 'all',
        specificValue: '',
        minCartValue: '',
        userId: '',
        usageType: 'once',
        usageLimit: 1,
        expiryDate: '',
        published: false,
    });

    const handleDeleteCoupon = async (id) => {
        try {
            const res = await axios.delete(backendURL+ `/api/coupon/delete/${id}`, { headers: { token } });

            if (res.data.success){
                toast.success("Coupon deleted successfully");
                fetchCoupons();
            }
            else {
                console.log(res.data.message );
                toast.error(res.data.message || 'Failed to delete coupon');
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting coupon");
        }
    }

    const fetchCoupons = async () => {
        try {
            const res = await axios.get(backendURL + "/api/coupon/getCoupon", { headers: { token } });
            setCoupons(res.data.coupons);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch coupons");
        }
    };

    const handleCreateCoupon = async () => {
        try {
            const res = await axios.post(backendURL + '/api/coupon/createCoupon', formData, { headers: { token } });
            if(res.data.success){
                toast.success('Coupon Created!');
            }
            else {
                console.log(res.data.message);
                toast.error("Coupon not created");
            }
            setFormData({ code: '', description: '', discountType: 'percentage', discountValue: '', published: false, usageLimit: 1 });
            fetchCoupons();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    return (
        <div className='p-4'>
            <h2 className='text-xl font-semibold mb-4'>Coupon Management</h2>

            <div className='border p-4 rounded-lg shadow mb-6'>
                <h3 className='text-lg font-semibold mb-2'> Create Coupon </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <input type="text" placeholder='Coupon Code' value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} className='border p-2 rounded' />
                    <input type="text" placeholder='Description' value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className='border p-2 rounded' />
                    <select value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })} className='border p-2 rounded' >
                        <option value="percent">Percentage (%)</option>
                        <option value="amount">Flat Amount (₹)</option>
                    </select>
                    <input type="number" placeholder='Discount Value' value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} className='border p-2 rounded' />
                    
                    <select value={formData.appliesTo} onChange={e => {setFormData({...formData, appliesTo: e.target.value}); console.log("Selected AppliesTo:", e.target.value);}} className='border p-2 rounded'>
                        <option value="all">All Orders</option>
                        <option value="product">Specific Product</option>
                        <option value="category">Product Category</option>
                        <option value="subcategory">Product Subcategory</option>
                        <option value="user">Specific User</option>
                        <option value="cartTotal">Orders Above (₹)</option>
                    </select>

                    {formData.appliesTo === 'product' && (
                        <input type="text" placeholder='Product ID' value={formData.specificValue} onChange={e => setFormData({ ...formData, specificValue: e.target.value})} className='border p-2 rounded'/>
                    )}

                    {formData.appliesTo === 'category' && (
                        <input type="text" placeholder='Category Name' value={formData.specificValue} onChange={e => setFormData({ ...formData, specificValue: e.target.value})} className='border p-2 rounded'/>
                    )}

                    {formData.appliesTo === 'subcategory' && (
                        <input type="text" placeholder='Subcategory Name' value={formData.specificValue} onChange={e => setFormData({ ...formData, specificValue: e.target.value})} className='border p-2 rounded'/>
                    )}
                    
                    {formData.appliesTo === 'user' && (
                        <input type="text" placeholder='User ID' value={formData.userId} onChange={e => setFormData({ ...formData, userId: e.target.value})} className='border p-2 rounded'/>
                    )}

                    {formData.appliesTo === 'cartTotal' && (
                        <input type="number" placeholder='Minimum Cart Value' value={formData.minCartValue} onChange={e => setFormData({ ...formData, userId: e.target.value})} className='border p-2 rounded'/>
                    )}

                    <select value={formData.usageType} onChange={e => setFormData({ ...formData, usageType: e.target.value })}>
                        <option value="once">Once</option>
                        <option value="unlimited">Unlimited</option>
                        <option value="limited">limited</option>
                    </select>

                    {formData.usageType === 'limited' && (
                        <input type="number" placeholder='Usage Limit' value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value})}/>
                    )}

                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className='border p-2 rounded'/>
                    
                    <input type="number" placeholder='Usage Limit' value={formData.usageLimit} onChange={e => setFormData({ ...formData, usageLimit: e.target.value })} className='border p-2 rounded' />
                    <div className='flex items-center gap-2'>
                        <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} />
                        <label> Publish Now </label>
                    </div>
                </div>
                <button onClick={handleCreateCoupon} className='mt-4 px-4 py-2 bg-blue-600 text-white rounded'> Create Coupon </button>
            </div>

            <div>
                <h3 className='text-lg font-semibold mb-2'> All Coupons</h3>
                <div className="space-y-4">
                    {coupons.map((coupon, index) => (
                        <div key={coupon._id} className="flex items-center gap-4 p-4 border rounded-md shadow bg-white">

                            {/* Left: Coupon Card */}
                            <div className="flex-1 bg-blue-600 text-white p-4 rounded-md relative">
                                <h3 className="text-md font-semibold">
                                    COUPON CODE: <span className="font-bold tracking-wide">{coupon.code}</span>
                                    <button
                                        className="ml-2 text-white text-sm"
                                        onClick={() => navigator.clipboard.writeText(coupon.code)}
                                        title="Copy code"
                                    >
                                        📋
                                    </button>
                                </h3>

                                <p className="mt-2">
                                    Discount {coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} for all orders
                                </p>

                            </div>

                            {/* Right: Info + Actions */}
                            <div className="flex flex-col items-center justify-between min-w-[100px]">
                                <div className="text-gray-700 text-sm">Usage: {coupon.usageCount}/{coupon.usageLimit}</div>
                                <div className="text-gray-500 text-sm">
                                    {coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '—'}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="bg-blue-600 text-white px-2 py-1 rounded"
                                        title="Edit"
                                        onClick={() => {/* open edit modal */ }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 text-white px-2 py-1 rounded"
                                        title="Delete"
                                        onClick={() =>  handleDeleteCoupon(coupon._id) }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Coupons