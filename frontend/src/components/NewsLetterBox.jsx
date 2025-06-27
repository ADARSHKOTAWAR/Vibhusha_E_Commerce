import React from 'react';

const NewsLetterBox = () => {

  const onSubmitHandler = (event) => {
    event.preventDefault();
    // Add subscription logic here
  }

  return (
    <div className='text-center px-4'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now & get 20% off</p>
      <p className='text-gray-400 mt-3'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      </p>

      <form 
        onSubmit={onSubmitHandler} 
        className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-gray-300 pl-3 rounded-md'
      >
        <input 
          className='w-full outline-none py-3 text-sm' 
          type="email" 
          placeholder="Enter your email" 
          required 
        />
        <button 
          className="bg-black text-white text-xs px-6 py-3 rounded-r-md" 
          type='submit'
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsLetterBox;
