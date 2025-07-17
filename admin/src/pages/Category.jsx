import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const Category = ({ token }) => {

    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubCat, setNewSubCat] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const fetchCategories = async () => {
        try {

            const response = await axios.get(backendURL + '/api/category/get', {});
            setCategories(response.data.categories);

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleAdd = async () => {
        if (!newCategory.trim()) return;

        try {
            const response = await axios.post(backendURL + '/api/category/create', { name: newCategory }, { headers: { token } });
            toast.success(response.data.message || 'Category Added!');
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleDelete = async (id) => {

        try {
            const response = await axios.delete(`${backendURL}/api/category/delete/${id}`, { headers: { token } });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchCategories();
            } else {
                console.log(response.data);
                console.log(token);
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleAddSubCategory = async () => {
        if (!newSubCat.trim()) return;

        try {
            const response = await axios.post(`${backendURL}/api/category/add-subcategory/${selectedId}`, { subCategory: newSubCat }, { headers: { token } });
            setNewSubCat('');
            toast.success(response.data.message);
            fetchCategories();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const handleDeleteSubCategory = async (subCategory) => {
        try {
            await axios.delete(`${backendURL}/api/category/delete-subcategory/${selectedId}`, { headers: { token }, params: { subCategory } });
            toast.success("Subcategory deleted Successfully.");
            fetchCategories();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className='max-w-xl mx-auto mt-10 p-4 shadow-md border rounded-lg'>
                <h2 className='text-2xl font-bold mb-4'>Manage Categories</h2>
                <div className='flex gap-2 mb-4'>
                    <input type="text" className='border p-2 w-full' placeholder='Enter new category' value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' onClick={handleAdd}>Add</button>
                </div>

                <div>
                    <ul className='space-y-2'>
                        {categories.map((cat) => (
                            <li key={cat._id} className='flex justify-between items-center bg-gray-100 px-3 py-2 rounded'>
                                <span>{cat.name}</span>
                                <button className='text-red-600 hover:underline' onClick={() => handleDelete(cat._id)}>Delete</button>
                            </li>
                        ))}

                    </ul>
                </div>

            </div>

            <div className="max-w-xl mx-auto mt-10 p-4 border shadow-lg rounded-md">
                <h2 className="text-2xl font-bold mb-4">Manage Subcategories</h2>

                <select className="w-full p-2 border mb-4" onChange={(e) => setSelectedId(e.target.value)}>
                    <option value=""> Select Category </option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>

                {selectedId && (
                    <>
                        <div className='flex gap-2 mb-4'>

                            <input type="text" className='border p-2 w-full' placeholder='New Subcategory' value={newSubCat} onChange={(e) => setNewSubCat(e.target.value)} />
                            <button className="bg-green-600 text-white px-4 rounded" onClick={handleAddSubCategory}> Add </button>

                        </div>
                        <ul className="list-disc list-inside space-y-2">
                            {categories.find(cat => cat._id === selectedId)?.subcategories?.map((sc, index) => (
                                <li key={index} className='flex justify-between items-center'>
                                    {sc}
                                    <button className="text-red-600 text-sm" onClick={() => handleDeleteSubCategory(sc)}>
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>

    )
}

export default Category;