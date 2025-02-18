import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NDVIResultDTO } from "../types/types";
import { getResultById } from "../api/axiosConfig";
import LoadingSpinner from "./LoadingSpinner";
import NDVIStatistics from "./NDVIStatistics";

const ResultDetail = () => {
  const navigate = useNavigate();
  const params = useParams<{resultId: string}>();
  const resultId = params.resultId;
  const [result, setResult] = useState<NDVIResultDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) return;

      try {
        const data = await getResultById(resultId);
        setResult(data);
      } catch (error) {
        setError("Error fetching data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) return <LoadingSpinner />;

  if (error || !result) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error || "Result not found"}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const formattedDate = new Date(result.createdAt).toLocaleDateString();

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {result.title}
              </h2>
              <span className="text-sm text-gray-500">
                Processed on: {formattedDate}
              </span>
            </div>

            <div className=" md:grid-cols-3 gap-6 mb-8 ">
              {/* <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  Red Band
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={result.redBandUrl}
                    alt="Red band input"
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  NIR Band
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={result.nirBandUrl}
                    alt="NIR band input"
                    className="w-full h-auto"
                  />
                </div>
              </div> */}

              <div className="space-y-2 items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-700">
                  NDVI Result
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={result.outputBandUrl}
                    alt="NDVI output"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            <NDVIStatistics statistics={result.statistics} />

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
              >
                Back to Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultDetail;
