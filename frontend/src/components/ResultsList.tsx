import React, { useEffect, useState, useCallback } from "react";
import { getResults } from "../api/axiosConfig";
import { NDVIResultDTO } from "../types/types";
import LoadingSpinner from "./LoadingSpinner";
import ResultCard from "./ResultCard";

const ResultsList: React.FC = () => {
  const [results, setResults] = useState<NDVIResultDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetchResults function
  const fetchResults = useCallback(async () => {
    try {
      const response = await getResults();
      console.log("API Response:", response); // Debugging

      if (!Array.isArray(response)) {
        throw new Error("API response is not an array");
      }
      setResults(response);
    } catch (err) {
      console.error(err);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures this is memoized once

  useEffect(() => {
    fetchResults(); // Call the memoized fetchResults
  }, [fetchResults]); // Dependency on the memoized function

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          No NDVI results found. Upload images to generate results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  );
};

export default ResultsList;
