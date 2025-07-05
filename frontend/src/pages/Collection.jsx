import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';
import axios from 'axios';


const Collection = () => {
  const { products, search, backendURL } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(backendURL + '/api/category/get');
      setAllCategory(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // Apply filters, search and sort whenever inputs change
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) => selectedCategories.includes(item.category));
    }

    // Filter by subcategory
    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    // Filter by search input (case-insensitive match on name)
    if (search.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sorting
    if (sortOption === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [products, allCategory, selectedCategories, subCategory, sortOption, search]);

  // Set initial filtered products
  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden transition-transform ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt="dropdown"
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {allCategory.map((cat, index) => (
              <label key={index} className='flex gap-2'>
                <input type="checkbox" className='w-3' value={cat.name} checked={selectedCategories.includes(cat.name)} onChange={toggleCategory} />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Subcategory Filter */}
        {/* <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
            <p className='mb-3 text-sm font-medium'>TYPE</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              {
                [...new Set(
                  allCategory.map(catName => {
                    const match = allCategory.find(c => c.name === catName);
                    return match ? match.subCategory : [];
                  })
                  .flat()
                )].map((sub, i) => (
                  <label key={i} className='flex gap-2'><input type="checkbox" className='w-3' value={sub} checked={subCategory.includes(sub)} onChange={toggleSubCategory}/>{sub}</label>
                ))
              }
            </div>
        </div> */}
      </div>
      <div>
        {/* Product Listing */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1="ALL" text2="COLLECTIONS" />
            <select
              className="border-2 border-gray-300 text-sm px-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort by: Relevance</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.length > 0 ? (
              filterProducts.map((item) => (
                item.publish ?
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={item.image}
                    discount={item.discount}
                    MRP={item.MRP}
                  /> : ""
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No products found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
