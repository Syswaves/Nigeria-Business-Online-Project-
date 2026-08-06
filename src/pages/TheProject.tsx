import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function TheProject() {
  return (
    <div className="flex flex-col">
      <Helmet>
        <title>About The Project | Nigeria Business Online</title>
        <meta name="description" content="The Nigeria Business Online Project is a comprehensive business profiling platform designed to showcase businesses, companies, and organizations across Nigeria to the world." />
      </Helmet>
      {/* About The Project Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About The Project</h2>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Business Seen. Trusted. Chosen.</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                In today's digital world, if customers can't find your business online, they're likely choosing your competitors. The Nigeria Business Online Project provides a platform where thousands of forward-thinking businesses can create their professional business profiles. Showcase their products and services, display their contact information, build credibility, and increase their visibility to customers, partners, investors, and government agencies—all from this trusted platform.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Whether you're a startup, SME, corporate organization, manufacturer, service provider, NGO, or government-approved business, your profile becomes your digital identity, helping you attract new opportunities and establish legitimacy.
              </p>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Why Get Profiled?</h4>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
                <li>Increase your online visibility and reach more customers.</li>
                <li>Build trust and credibility with a verified business presence.</li>
                <li>Promote your products and services 24/7.</li>
                <li>Improve your chances of being discovered by clients, investors, and partners.</li>
                <li>Strengthen your brand with a professional online profile.</li>
              </ul>
              <p className="text-lg font-medium text-gray-800 mb-8">
                Don't let your business remain invisible.<br/>
                Create your profile today and put your business where customers are searching.<br/>
                Get Discovered. Grow Your Business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/add-business" 
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Create your Business Page Now
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
                <p className="text-gray-600 mb-6">Search our platform of verified Nigerian businesses by name, category, or location.</p>
                
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
