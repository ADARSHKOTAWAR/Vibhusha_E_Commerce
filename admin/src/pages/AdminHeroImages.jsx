import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios'; 
import { backendURL } from '../App'; 

const AdminHeroImages = ({ token }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [heroImages, setHeroImages] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 

  
  const fetchHeroImages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/hero-images/list`);
      if (response.data.success) {
        setHeroImages(response.data.images);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      toast.error('Failed to fetch hero images.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for when a file is selected
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  // Handler for adding an image (now connected to backend)
  const handleAddImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to add.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage); 

    try {
      const response = await axios.post(`${backendURL}/api/hero-images/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', token
        },
      });

      if (response.data.success) {
        toast.success("Image added successfully!");
        setSelectedImage(null); // Clear selected file
        setImagePreview(null); // Clear preview
        await fetchHeroImages(); // Re-fetch images to update the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error adding hero image:', error);
      toast.error('Failed to add hero image.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for removing an image (now connected to backend)
  const handleRemoveImage = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${backendURL}/api/hero-images/remove/${id}`, {
        headers: {
         token
        },
      });

      if (response.data.success) {
        toast.info("Image removed successfully!");
        await fetchHeroImages(); // Re-fetch images to update the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing hero image:', error);
      toast.error('Failed to remove hero image.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch images on component mount
  useEffect(() => {
    fetchHeroImages();
  }, []); // Empty dependency array means it runs once on mount

  // Clean up object URLs when component unmounts or imagePreview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h3 className="text-2xl font-bold my-4 text-gray-800 border-b pb-2">Manage Hero Section Images</h3>

      {/* Image Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h4 className="text-xl font-semibold mb-4 text-gray-700">Add New Hero Image</h4>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100 cursor-pointer
                       border border-gray-300 rounded-md p-2"
            disabled={isLoading}
          />
          {imagePreview && (
            <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="w-32 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
              />
            </div>
          )}
          <button
            onClick={handleAddImage}
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md
                       transition duration-300 ease-in-out shadow-md hover:shadow-lg
                       focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Image'}
          </button>
        </div>
      </div>

      {/* Display Existing Images Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold mb-4 text-gray-700">Existing Hero Images</h4>
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading images...</p>
        ) : heroImages.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hero images added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((image) => (
              <div key={image._id} className="relative bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 flex justify-between items-center">
                  <span className="text-gray-700 text-sm font-medium truncate">{image.alt}</span>
                  <button
                    onClick={() => handleRemoveImage(image._id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm
                               transition duration-300 ease-in-out shadow-sm hover:shadow-md
                               focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Image"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHeroImages;
