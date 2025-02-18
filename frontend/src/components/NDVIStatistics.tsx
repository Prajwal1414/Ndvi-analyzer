import React from 'react';
import { NDVIStatistics as NDVIStatsType } from '../types/types';
interface NDVIStatisticsProps {
  statistics: NDVIStatsType;
}

const NDVIStatistics: React.FC<NDVIStatisticsProps> = ({ statistics }) => {
  const formatNumber = (num: number) => num.toFixed(4);
  
  const stats = [
    { label: 'Minimum', value: formatNumber(statistics.minNdvi) },
    { label: 'Maximum', value: formatNumber(statistics.maxNdvi) },
    { label: 'Mean', value: formatNumber(statistics.meanNdvi) },
    { label: 'Median', value: formatNumber(statistics.medianNdvi) },
    { label: 'Standard Deviation', value: formatNumber(statistics.stdNdvi) },
    { label: 'Vegetation Coverage', value: formatNumber(statistics.vegetationCoverage) },
    { label: 'Timestamp', value: new Date(statistics.timestamp).toLocaleString() },
    { label: 'Pixel count', value: statistics.pixelCount.toLocaleString() },
  ];

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">NDVI Statistics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-lg font-medium text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          <strong>Note:</strong> NDVI values typically range from -1 to 1. Higher positive values indicate 
          healthier vegetation, values around zero indicate no vegetation, and negative values 
          may represent water, clouds, or snow.
        </p>
      </div>
    </div>
  );
};

export default NDVIStatistics;