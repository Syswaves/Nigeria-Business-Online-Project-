import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export default function TheProject() {
  return (
    <div className="flex flex-col">
      {/* About The Project Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About The Project</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Nigeria Business Online Project is a comprehensive business profiling platform designed to showcase businesses, companies, and organizations across Nigeria to the world.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                It is a centralized hub where potential clients can easily discover, verify, and patronize legitimate Nigerian enterprises. We provide transparent profiles of businesses complete with services, contact details, and corporate information. We foster trust and drive economic growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/add-business" 
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Add Your Business
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white border border-gray-300 hover:border-green-700 hover:text-green-700 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-200 rounded-full opacity-50 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-200 rounded-full opacity-50 blur-3xl" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Find a Business</h3>
                <p className="text-gray-600 mb-6">Search our directory of verified Nigerian businesses by name, category, or location.</p>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const q = new FormData(e.currentTarget).get('q');
                    if (q) window.location.href = `/search?q=${encodeURIComponent(q as string)}`;
                  }} 
                  className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-2"
                >
                  <div className="flex-1 flex items-center px-4 py-2">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input 
                      type="text" 
                      name="q"
                      placeholder="e.g., Tech, Lagos, Logistics..." 
                      className="w-full focus:outline-none text-gray-700"
                      required
                    />
                  </div>
                  <button type="submit" className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl font-medium transition-colors">
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
