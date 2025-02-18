import React from 'react';
import { Link } from 'react-router-dom';
import { NDVIResultDTO } from '../types/types';
interface ResultCardProps {
  result: NDVIResultDTO;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const formattedDate = new Date(result.createdAt).toLocaleDateString();
  
  return (
    <Link to={`/result/${result.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="relative h-48">
          <img 
            src={result.outputBandUrl} 
            alt={`NDVI result for ${result.title}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{result.title}</h3>
          <p className="text-sm text-gray-500 mb-2">Processed on: {formattedDate}</p>
          
          <div className="flex justify-between text-sm">
            <span>Mean: {result.statistics.meanNdvi.toFixed(2)}</span>
            <span>Min: {result.statistics.minNdvi.toFixed(2)}</span>
            <span>Max: {result.statistics.maxNdvi.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ResultCard;