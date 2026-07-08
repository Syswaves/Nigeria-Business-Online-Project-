import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapPin, Search, BadgeCheck } from "lucide-react";
import type { Business } from "../types";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/businesses?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600 text-lg">
          {loading ? "Searching..." : `Found ${results.length} results for "${query}"`}
        </p>
      </div>

      {!loading && results.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
          <Search className="mx-auto text-gray-300 mb-4" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h2>
          <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories.</p>
          <Link to="/" className="text-green-700 font-medium hover:underline">Return to Home</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && results.map((business) => (
          <Link 
            key={business.id}
            to={`/business/${business.id}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all flex flex-col h-full group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl bg-green-50">
                    {business.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 flex items-center gap-1.5">
                  {business.name}
                  {business.verified && <BadgeCheck size={16} className="text-blue-600 flex-shrink-0" />}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {business.category}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
              {business.services}
            </p>
            
            <div className="pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={16} className="text-gray-400" />
              <span className="truncate">{business.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
