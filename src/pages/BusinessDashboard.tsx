import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LogOut, Save } from "lucide-react";
import type { Business } from "../types";

export default function BusinessDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [business, setBusiness] = useState<Business | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    fetch("/api/business/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setBusiness(data);
      setIsAuthenticated(true);
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    
    setIsSubmitting(true);
    setError("");

    fetch(`/api/businesses/${business.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(business)
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setBusiness(data);
      alert("Profile updated successfully!");
    })
    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  if (!isAuthenticated || !business) {
    return (
      <div className="max-w-md mx-auto px-4 py-32">
        <Helmet>
          <title>Business Login | Nigeria Business Online</title>
        </Helmet>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Business Page Dashboard Login</h1>
          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>Business Dashboard | Nigeria Business Online</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your business profile information</p>
        </div>
        <button 
          onClick={() => {
            setIsAuthenticated(false);
            setBusiness(null);
            setUsername("");
            setPassword("");
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {error && <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input 
                type="text" 
                value={business.name || ""}
                onChange={(e) => setBusiness({...business, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={business.email || ""}
                onChange={(e) => setBusiness({...business, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input 
                type="text" 
                value={business.phone || ""}
                onChange={(e) => setBusiness({...business, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
              <input 
                type="text" 
                value={business.location || ""}
                onChange={(e) => setBusiness({...business, location: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">About Us</label>
              <textarea 
                value={business.aboutUs || ""}
                onChange={(e) => setBusiness({...business, aboutUs: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none h-32"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Services & Products</label>
              <textarea 
                value={business.services || ""}
                onChange={(e) => setBusiness({...business, services: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none h-32"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
              <input 
                type="url" 
                value={business.website || ""}
                onChange={(e) => setBusiness({...business, website: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number (Optional)</label>
              <input 
                type="text" 
                value={business.whatsapp || ""}
                onChange={(e) => setBusiness({...business, whatsapp: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              <Save size={20} />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
