import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { processImages } from "../api/axiosConfig";

const UploadForm: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [redBand, setRedBand] = useState<File | null>(null);
  const [nirBand, setNirBand] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !redBand || !nirBand) {
      setError("Please fill in all the fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("redBand", redBand);
      formData.append("nirBand", nirBand);

      const result = await processImages(formData);
      navigate(`/result/${result.id}`);
    } catch (error) {
      setError("An error occured while processing the image");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Upload Images for NDVI Processing
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a descriptive text"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="redBand"
              className="block text-gray-700 font-medium mb-2"
            >
              Red band image
            </label>
            <input
              type="file"
              id="redBand"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              onChange={(e) => handleFileChange(e, setRedBand)}
            />
            {redBand && (
              <p className="mt-1 text-sm text-gray-500">
                Selected: {redBand.name}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="nirBand"
              className="block text-gray-700 font-medium mb-2"
            >
              NIR Band Image
            </label>
            <input
              type="file"
              id="nirBand"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setNirBand)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            {nirBand && (
              <p className="mt-1 text-sm text-gray-500">
                Selected: {nirBand.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Process Image"}
          </button>
        </form>
        {loading && <LoadingSpinner />}
      </div>
    </>
  );
};

export default UploadForm;
