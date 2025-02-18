import { Link } from "react-router-dom";
import ResultsList from "../components/ResultsList";
const HomePage: React.FC = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">NDVI Analysis Results</h1>
          <Link
            to="/upload"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Upload Images
          </Link>
        </div>
        
        <ResultsList />
      </div>
    );
  };

export default HomePage