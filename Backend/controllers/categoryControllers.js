import Category from "../models/categoryModel.js";


// get Category
const getCategories = async (req, res) => {
    try {
        
        const categories = await Category.find().sort({ name: 1 });
        res.json({success:true, categories});

    } catch (error) {
        res.json({success:false, message: error.message});
    }
};


//create category
const createCategory = async (req, res) => {

        const {name} = req.body;

        if(!name || name.trim() === ''){
            return res.json({success: false, message:"Category Name is Required"});
        }

        try {

            const existing = await Category.findOne({name: name.trim()});
            if(existing){
                res.json({success: false, message:"Category name already exists"});
            }

            const category = new Category({name: name.trim()});
            await category.save();
            res.json({success: true, category, message:"Category Created"});
            
        } catch (error) {

            console.log(error);
            res.json({success:false, message: error.message});
            
        }
   
}

//delete category
const deleteCategory = async ( req, res ) => {
    const {id} = req.params;

    try {

        const deleted = await Category.findByIdAndDelete(id);

        if(!deleted){
            res.json({success: false, message: "Category not found"});
        }
        res.json({success: true, message: "Category Deleted Successfuly"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

const addSubCategory = async ( req, res ) => {
    const {id} = req.params;
    const {subCategory} = req.body;

    try {
        const category = await Category.findById(id);
        if(!category) res.json({success:false, message:"Category not Found"});

        if(category.subcategories.includes(subCategory)) res.json({success:false, message:"Category already exists"});

        category.subcategories.push(subCategory);
        res.json({success:true, message:"Category created Successfully"});
        await category.save();
        

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const deleteSubCategory = async( req, res ) => {

    const {id} = req.params;
    const { subCategory } = req.query;

    try {
        
        const category = await Category.findById(id);
        if(!category) res.json({success:false, message:"Category not Found"});

        category.subcategories = category.subcategories.filter(sc => sc !== subCategory);
        await category.save();
        res.json({success: true, message:"Categoty Deleted!"});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }

}

export {getCategories, createCategory, deleteCategory, addSubCategory, deleteSubCategory};
