import React, { useEffect, useState } from "react";
import { Plus, Search, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import type { Business } from "../types";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    rcNumber: "",
    category: "",
    services: "",
    phone: "",
    location: "",
    email: "",
    website: "",
    whatsapp: "",
    verified: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBusinesses = () => {
    fetch("/api/businesses")
      .then(res => res.json())
      .then(data => {
        setBusinesses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "@El-roiSeesMe") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-32">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" 
                placeholder="Enter admin password"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    fetch("/api/businesses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => {
      setIsSubmitting(false);
      setShowAddForm(false);
      setFormData({
        name: "", logoUrl: "", rcNumber: "", category: "", 
        services: "", phone: "", location: "", email: "", website: "", whatsapp: "", verified: false
      });
      fetchBusinesses();
    })
    .catch(err => {
      console.error(err);
      setIsSubmitting(false);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform content and verified businesses</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          {showAddForm ? "Close Form" : <><Plus size={18} /> Add New Business</>}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Direct Entry Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RC / BN Number *</label>
                <input required type="text" name="rcNumber" value={formData.rcNumber} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none bg-white">
                  <option value="">Select Category</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Technology">Technology</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Services">Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Rendered *</label>
                <textarea required name="services" value={formData.services} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address *</label>
                <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" id="verified" name="verified" checked={formData.verified} onChange={(e) => setFormData({ ...formData, verified: e.target.checked })} className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-600" />
                <label htmlFor="verified" className="text-sm font-medium text-gray-700 flex items-center gap-1"><BadgeCheck size={16} className="text-blue-600" /> Mark as Verified Business</label>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-8 py-2.5 rounded-xl font-medium transition-colors"
              >
                {isSubmitting ? "Saving..." : "Save Business"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-900 text-lg">Published Businesses</h2>
          <span className="bg-white px-3 py-1 rounded-full text-sm font-medium border border-gray-200 text-gray-600">
            {businesses.length} Total
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-medium">Business Info</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Added On</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading data...</td></tr>
              ) : businesses.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No businesses found. Add one to get started.</td></tr>
              ) : (
                businesses.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                          {business.logoUrl ? (
                            <img src={business.logoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Briefcase size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-1.5">
                            {business.name}
                            {business.verified && <BadgeCheck size={14} className="text-blue-600 flex-shrink-0" />}
                          </p>
                          <p className="text-xs text-gray-500">{business.rcNumber} • {business.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{business.email}</p>
                      <p className="text-xs text-gray-500">{business.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-600">{new Date(business.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-right">
                      <a href={`/business/${business.id}`} target="_blank" rel="noreferrer" className="text-green-600 hover:text-green-800 text-sm font-medium mr-4">
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
