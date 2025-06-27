import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const AddOfflineOrder = ({token}) => {
    
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    useEffect (() => {
        axios.get(backendURL + '/api/product/list')
         .then(res => setProducts(res.data.products));
    }, []);

    const addProductToOrder = (productId, quantity) => {
        const product = products.find( p => p._id === productId );

        if( !product ) return;
        setSelectedItems([ ...selectedItems, { productId, name: product.name, quantity, price: product.price }]);
    };

    console.log(selectedItems);
    
    const total = selectedItems.reduce(( sum, p ) => sum + p.quantity * p.price, 0 );

    const placeOrder = async () => {
        try {
            
            const items = selectedItems.map(p => ({
                productId: p.productId,
                quantity: p.quantity,
                name: p.name,
                price: p.price
            }));

            const res = await axios.post(backendURL + '/api/order/offlineOrder', {items, amount: total, paymentMethod, payment:true, date: Date.now(), orderSource: 'offline', customerName, customerPhone},{headers : {token}});

            if(res.data.success){
                toast.success('Order placed successfully!');
            }
            else{
                console.log(res.data.message);
                toast.error("Order Not Placed");
            }
            setSelectedItems([]);
        } catch (error) {
            console.log(error);
            toast.error("Order Not Placed");
        }
    }

  return (
    <div className='p-4 max-w-xl mx-auto'>
        <h2 className='text-lg font-bold mb-4'>Offline Order</h2>

        {products.map(p => (
            <div key={p._id} className='flex gap-2 items-center'>
                <span>{p.name} (₹{p.price})</span>

                <input type="number" min='1' placeholder='Qty' onBlur={(e) => addProductToOrder(p._id, parseInt(e.target.value))}/>

            </div>
        ))}

        <input type={customerName} onChange={e => setCustomerName(e.target.value)} placeholder='Customer Name' className="mt-4 border"/>
        <input type={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder='Phone Number' className="mt-2 border"/>
        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className='mt-2 border'>
            <option value="cash"> Cash </option>
            <option value="upi"> UPI </option>
            <option value="card"> Card </option>
        </select>

        <p className='mt-4 font-bold'> Total: ₹{total} </p>
        <button onClick={placeOrder} className='bg-green-500 text-white px-4 py-2 mt-2'>Place Offline Order</button>
    </div>
  )
}

export default AddOfflineOrder