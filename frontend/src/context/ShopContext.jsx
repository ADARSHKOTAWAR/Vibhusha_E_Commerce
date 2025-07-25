import React, { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Create the context
export const ShopContext = createContext();

// Context provider component
const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const navigate = useNavigate();


  const addToCart = async (itemId, size) => {

    if(!size){
        toast.error("Select Size");
        return;
    }

    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
      if(cartData[itemId][size]){
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }
    }
    else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
    }
    setCartItems(cartData);

    if(token){
      try {

        const response = await axios.post(backendURL+'/api/cart/add', {itemId, size}, {headers:{token}});
        if(response.success){
          toast.success(response.message);
        } else{
          toast.error(response.message);
        }

      } catch(error){
        console.log(error);
        toast.error(error.message);
      }
    }

  }



  const getCartCount = () => {
    let totalCount = 0;
    for(const items in cartItems){
        for(const item in cartItems[items]){
            try {
                if(cartItems[items][item] > 0){
                  totalCount += cartItems[items][item];
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    return totalCount;
  }

  const updateQuantity = async (itemId, size, quantity) => {

    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity; 

    setCartItems(cartData);

    if(token){
      try {

        await axios.post(backendURL+'/api/cart/update',{itemId, size, quantity}, {headers: {token}} )
        
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  }

  const getCartAmount = () => {
    let totalAmount = 0;

    for(const items in cartItems){
      let itemInfo = products.find((product) => product._id === items);
      
      if(!items) {
        console.log(`Product with ID ${items} not found on products list`);
        continue;
      }

      const sizes = cartItems[items];
      
      for(const size in sizes){
        const quantity = sizes[size];

        if( quantity > 0 ){
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
    return totalAmount;
  }

  const getProductsData = async () => {
    try {

      const response = await axios.get(backendURL+'/api/product/list');
      if(response.data.success){
        setProducts(response.data.products);
      } else{
        toast.error(response.data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const getUserCart = async (token) => {
    try {

      const response = await axios.post(backendURL+'/api/cart/get', {}, {headers:{token}});
      if(response.data.success){
        setCartItems(response.data.cartData);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(()=> {
    getProductsData();
  }, []);

  useEffect(() => {
    if(!token && localStorage.getItem('token')){
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'));
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendURL,
    setToken,
    setCartItems,
    token
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
