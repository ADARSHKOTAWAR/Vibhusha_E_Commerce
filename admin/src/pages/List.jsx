import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify'
import { currency } from '../App';

const List = ({token}) => {

    const [list, setList] = useState([]);

    const fetchList = async () => {

        try {

            const response = await axios.get(backendURL + '/api/product/list');
            if(response.data.success){
                setList(response.data.products);
            } else{
                toast.error(response.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    }

    const removeProduct = async (id) => {
        try {

            const response = await axios.post(backendURL + '/api/product/remove', {id}, {headers:{token}});

            if(response.data.success){
                toast.success(response.data.message);
                await fetchList();
            }else {
                toast.error(response.data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }
    }

    const togglePublish = async( id, currentStatus)=>{
        try {
            const res = await axios.put(backendURL + '/api/product/toggle-publish', { id, publish: !currentStatus }, { headers: { token } });
            if(res.data.success){
                toast.success(res.data.message);
                await fetchList();
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const handleQuantityChange = async (id, sizeIndex, newQuantity) => {
        try {
            const updatedList = list.map(product => {
                if(product._id === id){
                    const updatedSizes = [...product.sizes];
                    updatedSizes[sizeIndex] = {
                        ...updatedSizes[sizeIndex],
                        quantity: newQuantity
                    };
                    return { ...product, sizes: updatedSizes };
                }
                return product;
            });

            setList(updatedList);

            const res = await axios.put(backendURL + '/api/product/update-quantity', {
                id,
                size: list.find(p => p._id === id).sizes[sizeIndex].size,
                quantity: newQuantity
            }, {headers: {token}});

            if(res.data.success){
                toast.success("Quantity updated!");
            }else {
                console.log(res.data.message);
                toast.error("Faild to update quantity.");
            }

        } catch (error){
            console.log(error);
            toast.error("Error Updating quantity.");
        }
    };

    useEffect(()=> {
        fetchList();
    }, []);

  return (
    <>
        <p className='mb-2'>All Products List</p>
        <div className='flex flex-col gap-2'>
            {/* List Table Title */}
            <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_2fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Publish</b>
                <b className='text-center'>Action</b>
                <b>Sizes / Quantity</b>
            </div>

            {/* Product List */}
            {
                list.map((item, index) => (
                    <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_2fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                        <img className='w-12' src={item.image[0]} alt="" />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{currency}{item.price}</p>
                        {/* Publish */}
                        <button onClick={()=>togglePublish(item._id, item.publish)} className={`px-2 py-1 text-white rounded ${item.publish ? 'bg-red-500' : 'bg-green-500'}`}>
                           {item.publish ? 'Hide': 'Publish'} 
                        </button>
                        {/* Delete Column */}
                        <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
                        {/* Sizes and Quantities Column */}
                        <div className='flex flex-wrap gap-2'>
                            {item.sizes.map((sz, szIndex) => (
                                <div key={szIndex} className='flex items-center gap-1 border px-2 py-1 rounded'>
                                    <span className='font-semibold'>{sz.size}</span>
                                    <input type="number" min='0' value={sz.quantity} onChange={(e)=>handleQuantityChange(item._id, szIndex, parseInt(e.target.value))} className='w-12 border px-1 text-center'/>
                                </div>
                            ))

                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </>
  )
}

export default List