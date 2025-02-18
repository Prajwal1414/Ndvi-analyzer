import React from 'react';
import UploadForm from '../components/UploadForm';

const UploadPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Upload Images for NDVI Analysis</h1>
      <UploadForm />
      
      <div className="mt-12 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">About NDVI Analysis</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-4">
            The Normalized Difference Vegetation Index (NDVI) is a simple graphical indicator that 
            can be used to analyze remote sensing measurements, typically from satellite imagery,
            to assess whether the target being observed contains live green vegetation.
          </p>
          <p className="text-gray-700 mb-4">
            Upload a Red Band and Near-Infrared (NIR) Band image to calculate NDVI. These bands are 
            commonly available from multispectral satellite imagery.
          </p>
          <p className="text-gray-700">
            The formula used for NDVI calculation is: (NIR - Red) / (NIR + Red)
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;