import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Search, BadgeCheck } from "lucide-react";
import type { Business } from "../types";
import { motion } from "motion/react";

export default function Home() {
  const [latestBusinesses, setLatestBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    fetch("/api/businesses/latest")
      .then(res => res.json())
      .then(data => setLatestBusinesses(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-green-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6"
              >
                NIGERIA BUSINESS <br/>
                <span className="text-green-700">ONLINE PROJECT</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-light"
              >
                Promoting trust, growth and visibility for Nigerian Businesses. Create your Business Page / Profile  on Nigeria's Exclusive Business web platform NOW and expand your reach.. .   Connect with verified businesses and get top notch products and service delivery
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link 
                  to="/add-business" 
                  className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-700/20 w-fit"
                >
                  Add Your Business <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <video 
                  src="/hero-video.mp4" 
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent mix-blend-multiply"></div>
              </div>
              <div className="absolute -z-10 -bottom-6 -left-6 w-48 h-48 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
              <div className="absolute -z-10 -top-6 -right-6 w-48 h-48 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest Entry Display Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Latest Entries</h2>
              <p className="text-gray-600 mt-2">Trending</p>
            </div>
            <Link to="/search" className="text-green-700 font-medium hover:text-green-800 hidden sm:flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestBusinesses.map((business, i) => (
              <motion.div 
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link 
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
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="truncate">{business.location}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {latestBusinesses.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500">
                Loading latest entries...
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
