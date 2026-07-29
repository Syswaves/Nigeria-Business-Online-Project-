import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { LogOut, Save, Upload, Briefcase, Phone, Hash } from "lucide-react";
import type { Business } from "../types";

export default function BusinessDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
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
      body: JSON.stringify({ username: loginUsername, password: loginPassword })
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

    const submitData = { ...business };
    if (submitData.category === "Other" && (submitData as any).customCategory) {
      submitData.category = (submitData as any).customCategory;
    }
    delete (submitData as any).customCategory;

    fetch(`/api/businesses/${business.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (business) {
      setBusiness({ ...business, [e.target.name]: e.target.value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file && business) {
      if (fieldName === 'promoVideoUrl' && file.size > 15 * 1024 * 1024) {
        alert("Video file size must be a maximum of 15MB.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusiness({ ...business, [fieldName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
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
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
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
            setLoginUsername("");
            setLoginPassword("");
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {error && <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>}
        
        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Account Settings */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <LogOut className="text-green-700" size={20} /> Account Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username (Cannot be changed)</label>
                <input 
                  type="text" 
                  value={business.username || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                <input 
                  type="text" 
                  name="password"
                  value={business.password || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Briefcase className="text-green-700" size={20} /> Core Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input required type="text" name="name" value={business.name || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Slogan / Motto</label>
                <input type="text" name="slogan" value={business.slogan || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RC / BN Number (Optional)</label>
                <input type="text" name="rcNumber" value={business.rcNumber || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select required name="category" value={business.category || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none bg-white">
                  <option value="Agriculture">Agriculture & Agro-Allied</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Automotive">Automotive & Repair</option>
                  <option value="Automotive (Auto)">Automotive (Auto)</option>
                  <option value="Aviation">Aviation</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Beauty & Wellness">Beauty & Wellness</option>
                  <option value="Community & Religion">Community & Religion</option>
                  <option value="Construction & Contracting">Construction & Contracting</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Education">Education & Training</option>
                  <option value="Energy and Power">Energy and Power</option>
                  <option value="Engineering and Construction">Engineering and Construction</option>
                  <option value="Entertainment">Entertainment & Media</option>
                  <option value="Entertainment & Recreation">Entertainment & Recreation</option>
                  <option value="Environmental">Environmental Services</option>
                  <option value="Event Management">Event Management Services</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Finance">Financial Services</option>
                  <option value="Finance & Insurance">Finance & Insurance</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Government">Government & Public Services</option>
                  <option value="Government & Public Sector">Government & Public Sector</option>
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Healthcare">Healthcare & Pharmaceuticals</option>
                  <option value="Home & Property">Home & Property Services</option>
                  <option value="Home Services & Trades">Home Services & Trades</option>
                  <option value="Hospitality">Hospitality & Tourism</option>
                  <option value="Industrial">Industrial Services</option>
                  <option value="Industrial & Manufacturing">Industrial & Manufacturing</option>
                  <option value="Information & Communications Technology (ICT)">Information & Communications Technology (ICT)</option>
                  <option value="Legal">Legal Services</option>
                  <option value="Legal & Professional">Legal & Professional</option>
                  <option value="Lodging & Travel">Lodging & Travel</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Manufacturing">Manufacturing & Production</option>
                  <option value="Marine & Shipping">Marine & Shipping</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Marketing & Media">Marketing & Media</option>                  
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Mining">Mining & Solid Minerals</option>
                  <option value="Non-Profit">Non-Profit & NGO</option>
                  <option value="Oil and Gas">Oil and Gas</option>
                  <option value="Printing and Publishing">Printing and Publishing</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Real Estate & Property">Real Estate & Property</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Retail & Shopping">Retail & Shopping</option>
                  <option value="Security Services">Security Services</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Technology">Technology & Software</option>                  
                  <option value="Technology & IT">Technology & IT</option>                  
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Transportation & Logistics">Transportation & Logistics</option>
                  <option value="Other">Other</option>
                </select>
                {business.category === "Other" && (
                  <input 
                    required 
                    type="text" 
                    name="customCategory" 
                    value={(business as any).customCategory || ""} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 mt-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" 
                    placeholder="Please specify your business category" 
                  />
                )}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">About Us *</label>
                <textarea required name="aboutUs" value={business.aboutUs || ""} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none resize-none"></textarea>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Rendered *</label>
                <textarea required name="services" value={business.services || ""} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Phone className="text-green-700" size={20} /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number(s) *</label>
                <input required type="tel" name="phone" value={business.phone || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input required type="email" name="email" value={business.email || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                <input type="tel" name="whatsapp" value={business.whatsapp || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input type="url" name="website" value={business.website || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Office Address *</label>
                <input required type="text" name="location" value={business.location || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Hash className="text-green-700" size={20} /> Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <input type="text" name="facebookUrl" value={business.facebookUrl || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <input type="text" name="instagramUrl" value={business.instagramUrl || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <input type="text" name="twitterUrl" value={business.twitterUrl || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                <input type="text" name="linkedinUrl" value={business.linkedinUrl || ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Video URL (YouTube)</label>
                <input type="url" name="promoVideoUrl" value={business.promoVideoUrl && !business.promoVideoUrl.startsWith('data:') ? business.promoVideoUrl : ""} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
          </div>

          {/* Media & Documents */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Upload className="text-green-700" size={20} /> Documents & Media Updates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Company Logo</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} className="text-sm text-gray-500 w-full" />
                {business.logoUrl && <span className="text-xs text-green-600 mt-2 block">Current logo saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Certificate of Incorporation</label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'certificateOfIncorporationUrl')} className="text-sm text-gray-500 w-full" />
                {business.certificateOfIncorporationUrl && <span className="text-xs text-green-600 mt-2 block">Current certificate saved</span>}
              </div>
              <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Company Profile</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'companyProfileUrl')} className="text-sm text-gray-500 w-full" />
                {business.companyProfileUrl && <span className="text-xs text-green-600 mt-2 block">Current profile saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Video (Direct Upload)</label>
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'promoVideoUrl')} className="text-sm text-gray-500 w-full" />
                {business.promoVideoUrl && business.promoVideoUrl.startsWith('data:video') && <span className="text-xs text-green-600 mt-2 block">Current video saved</span>}
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Photo 1</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'promoPhoto1Url')} className="text-sm text-gray-500 w-full" />
                {business.promoPhoto1Url && <span className="text-xs text-green-600 mt-2 block">Current photo 1 saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Photo 2</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'promoPhoto2Url')} className="text-sm text-gray-500 w-full" />
                {business.promoPhoto2Url && <span className="text-xs text-green-600 mt-2 block">Current photo 2 saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Photo 3</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'promoPhoto3Url')} className="text-sm text-gray-500 w-full" />
                {business.promoPhoto3Url && <span className="text-xs text-green-600 mt-2 block">Current photo 3 saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Photo 4</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'promoPhoto4Url')} className="text-sm text-gray-500 w-full" />
                {business.promoPhoto4Url && <span className="text-xs text-green-600 mt-2 block">Current photo 4 saved</span>}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors col-span-1 md:col-span-2">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Update Promo Photo 5</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'promoPhoto5Url')} className="text-sm text-gray-500 w-full" />
                {business.promoPhoto5Url && <span className="text-xs text-green-600 mt-2 block">Current photo 5 saved</span>}
              </div>
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
