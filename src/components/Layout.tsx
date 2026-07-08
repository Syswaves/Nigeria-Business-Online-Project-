import { Link, Outlet, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, Search, Briefcase, Settings } from "lucide-react";
import React, { useState } from "react";

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/nigeriabusinessonlineproject-1-96x43.png" 
              alt="Nigeria Business Online Project" 
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <form onSubmit={handleSearch} className="relative w-64">
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </form>
            
            <Link 
              to="/" 
              className="text-gray-700 hover:text-green-700 font-medium transition-colors"
            >
              Home
            </Link>

            <Link 
              to="/project" 
              className="text-gray-700 hover:text-green-700 font-medium transition-colors"
            >
              The Project
            </Link>

            <Link 
              to="/add-business" 
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
            >
              Add Your Business
            </Link>

            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-700 font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg shadow-sm">
                <img 
                  src="/nigeriabusinessonlineproject-1-96x43.png" 
                  alt="Nigeria Business Online Project" 
                  className="h-8 w-auto"
                />
            </div>
            <p className="text-gray-400 text-sm max-w-xs text-center md:text-left">Promoting trust, growth and visibility for Nigerian Businesses.</p>
          </div>
          
          <div className="flex gap-4">
            <a href="https://www.facebook.com/nigeriabusinessonlineofficial/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="http://instagram.com/nigeriabusinessonlineofficial" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://x.com/Nigbizonline" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.975H5.036z" /></svg>
            </a>
            <a href="https://www.youtube.com/@nigeriabusinessonline" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Nigeria Business Online Project. All rights reserved.</p>
          <Link to="/admin" className="hover:text-white transition-colors mt-4 sm:mt-0 flex items-center justify-center p-2 rounded-full hover:bg-gray-800" title="Admin Dashboard">
            <Settings size={16} />
          </Link>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/2348071087326" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] hover:-translate-y-1 transition-all z-50 hover:shadow-xl"
        title="Chat with us on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
