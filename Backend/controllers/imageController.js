
import HeroImage from "../models/imageModel.js"; 
import cloudinary from 'cloudinary'; 


const addImage = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }

    
    const result = await cloudinary.v2.uploader.upload( 
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'ecommerce_hero_images',
        resource_type: 'image',
      }
    );

    
    const newHeroImage = new HeroImage({
      url: result.secure_url,
      alt: req.body.alt || 'E-commerce Hero Image', 
      public_id: result.public_id, 
    });

    
    await newHeroImage.save();

    res.status(201).json({ success: true, message: 'Hero image added successfully!', image: newHeroImage });

  } catch (error) {
    console.error('Error adding hero image:', error);
   
    if (error.code === 11000) { 
      return res.status(409).json({ success: false, message: 'An image with this URL already exists.' });
    }
    res.status(500).json({ success: false, message: 'Failed to add hero image.', error: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params; 

    const imageToDelete = await HeroImage.findById(id);

    if (!imageToDelete) {
      return res.status(404).json({ success: false, message: 'Hero image not found.' });
    }

    if (imageToDelete.public_id) {
      await cloudinary.v2.uploader.destroy(imageToDelete.public_id); 
      console.log(`Image with public_id ${imageToDelete.public_id} deleted from Cloudinary.`);
    }

    
    await HeroImage.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Hero image removed successfully!' });

  } catch (error) {
    console.error('Error deleting hero image:', error);
    res.status(500).json({ success: false, message: 'Failed to remove hero image.', error: error.message });
  }
};


const listImages = async (req, res) => {
  try {
    
    const images = await HeroImage.find({}).sort({ createdAt: 1 }); 

    res.status(200).json({ success: true, images: images });

  } catch (error) {
    console.error('Error fetching hero images:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch hero images.', error: error.message });
  }
};

export { addImage, deleteImage, listImages };
