import React, {useState, useEffect} from 'react'
import { assets } from '../assets/admin_assets/assets'
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify'

const Add = ({token}) => {

    // const [image1, setImage1] = useState(false);
    // const [image2, setImage2] = useState(false);
    // const [image3, setImage3] = useState(false);
    // const [image4, setImage4] = useState(false);
    const [images, setImages] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [MRP, setMRP] = useState("");
    const [discount, setDiscount] = useState("");
    const [finalPrice, setFinalPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [color, setColor] = useState('');
    const [trend, setTrend] = useState('');
    const [bestseller, setBestseller] = useState(false);
    const [publish, setPublish] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [sizeInput, setSizeInput] = useState({size:'', quantity:0});
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    
    const [baseMetal, setBaseMetal] = useState('');
    const [occasion, setOccasion] = useState('');
    const [plating, setPlating] = useState('');
    const [stoneType, setStoneType] = useState('');

    const handelImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);
    }

    const handelSizeChange = (index, field, value) => {
        const updatedSizes = [...sizes];
        updatedSizes[index][field] = field === 'quantity' ? parseInt(value) : value;
        setSizes(updatedSizes);
    }

    const addSize = () => {
        setSizes([...sizes, { size: '', quantity: 0 }]);
    }

    const removeSize = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("MRP", MRP);
            formData.append("discount", discount);
            formData.append("price", finalPrice);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("color", color);
            formData.append("trend", trend);
            formData.append("bestseller", bestseller);
            formData.append("sizes", JSON.stringify(sizes));
            formData.append("baseMetal", baseMetal);
            formData.append("occasion", occasion);
            formData.append("plating", plating);
            formData.append("stoneType", stoneType);
            formData.append('publish', publish);

            images.forEach((img) => {formData.append('images', img)});

            const response = await axios.post(backendURL + "/api/product/add", formData, {headers:{token}});
            
            if(response.data.success){
                toast.success(response.data.message);
                setName('');
                setDescription('');
                setMRP('');
                setDiscount('');
                setFinalPrice(0);
                setCategory('');
                setSubCategory('');
                setSizes([]);
                setImages([]);
                setBestseller(false);
                setBaseMetal('');
                setColor('');
                setTrend('');
                setOccasion('');
                setPlating('');
                setStoneType('');
            } else {
                toast.error(response.data.message);
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`${backendURL}/api/category/get`);
            setCategories(res.data.categories || []);
        }
        fetchCategories();
    }, []);

    useEffect(() => {
        if(category){
            const sub = categories.find(cat=> cat.name === category)?.subcategories || [];
            setSubCategories(sub);
        }
    }, [category, categories]);

    useEffect(()=>{
        if(MRP && discount){
            setFinalPrice((MRP - (MRP*discount/100)).toFixed(2));
        }
    }, [MRP, discount]);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3 mb-2'>
        <div >
           <p className='mb-2'>Upload Images</p>
           <input type="file" multiple onChange={handelImageUpload}/>
           <div className='flex gap-2 mt-2'>
                {images.map((img, index) => (
                    <img key={index} className='w-20 h-20 object-cover' src={URL.createObjectURL(img)} alt={`Preview ${index}`}/>
                ))}
           </div>
        </div>

        <input value={name} onChange={(e) => setName(e.target.value)}  className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Product Name' required/>
        
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className='w-full max-w-[500px] px-3 py-2' placeholder='Product Description' required />

        <div className='flex gap-4 flex-wrap'>
                <input type="number" value={MRP} onChange={(e)=>setMRP(e.target.value)} placeholder='MRP'className='px-3 py-2' required/>
                <input value={discount} onChange={(e)=> setDiscount(e.target.value)} type="number" placeholder='Discount %' className='px-3 py-2'/>
                <p className='px-3 py-2 border rounded bg-gray-100'>Final Price: ₹{finalPrice}</p>
        </div>
        
        {/* Categories */}
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className='px-3 py-2'>
                <option value="">Select Category</option>
                {categories.map((cat, i) => 
                    <option key={i} value={cat.name}> {cat.name} </option>
                )}
        </select>
        
        {/* SubCategories */}
        <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className='px-3 py-2'>
                <option value="">Select Subcategory</option>
                {subCategories.map((sub, index) => 
                    <option key={index} value={sub}>{sub}</option>
                )}
        </select>

        <input value={color} onChange={(e) => setColor(e.target.value)} className='px-3 py-2' type="text" placeholder='Color' />
        <input value={trend} onChange={(e) => setTrend(e.target.value)} className='px-3 py-2' type="text" placeholder='Trend Tag (Optional)' />
        <input value={baseMetal} onChange={(e) => setBaseMetal(e.target.value)} className='px-3 py-2' type="text" placeholder='Base Metal (Optional)' />
        <input value={occasion} onChange={(e) => setOccasion(e.target.value)} className='px-3 py-2' type="text" placeholder='Occasion (Optional)' />
        <input value={stoneType} onChange={(e) => setStoneType(e.target.value)} className='px-3 py-2' type="text" placeholder='Stone Type (Optional)' />
        <input value={plating} onChange={(e) => setPlating(e.target.value)} className='px-3 py-2' type="text" placeholder='Plating (Optional)' />

        {/* Dynamic Size Addition */}
        <div>
            <p className='mt-4 mb-2'> Sizes and Quantities</p>
            {sizes.map((sz, index) => (
                <div key={index} className='flex items-center gap-2 mb-1'>
                    <input type="text" value={sz.size} onChange={(e)=>handelSizeChange(index, 'size', e.target.value)} placeholder='Size' className='px-2 py-1' required/>
                    <input type="number" value={sz.quantity} onChange={(e)=>handelSizeChange(index, 'quantity', e.target.value)} placeholder='Quantity' className='px-2 py-1' required/>
                </div>
            ))}
            <button type='button' onClick={addSize} className='mt-1 px-3 py-1 bg-green-500 text-white rounded'>+ Add Size</button>
        </div>

        <div className='flex gap-2 mt-2'>
            <input onChange={() => setBestseller(prev=> !prev)} checked={bestseller} type="checkbox" id='bestseller'/>
            <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
        </div>
        <div className='flex gap-2 mt-2'>
            <input onChange={() => setPublish(prev=> !prev)} checked={publish} type="checkbox" id='publidh'/>
            <label className='cursor-pointer' htmlFor="publish">Publish</label>
        </div>

        <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  )
}

export default Add