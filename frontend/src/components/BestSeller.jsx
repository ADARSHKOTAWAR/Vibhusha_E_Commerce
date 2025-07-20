import React, {useContext, useState, useEffect} from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const {products} = useContext(ShopContext);
    
    const [bestseller, setbestseller] = useState([]);

    useEffect(() => {
        const bestproducts= products.filter((item)=>(item.bestseller));
        setbestseller(bestproducts.slice(0,5))
    },[products])

  return (
    <div>
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
            <Title text1={'BEST'}text2={'SELLERS'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-grey-600'>
                Explore our best sellers — the most loved pieces that define timeless style and elegance.
            </p>
            </div>
        </div>
        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid:cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                bestseller .map((item, index) => (
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price}/>
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller;