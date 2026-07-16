import React, { useEffect, useState } from "react";
import { Plus, Search, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import type { Business } from "../types";
import { Helmet } from "react-helmet-async";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    name: "", logoUrl: "", certificateOfIncorporationUrl: "", companyProfileUrl: "", rcNumber: "", category: "", services: "",
    phone: "", location: "", email: "", website: "", whatsapp: "",
    facebookUrl: "", instagramUrl: "", twitterUrl: "", linkedinUrl: "",
    promoVideoUrl: "", promoPhoto1Url: "", promoPhoto2Url: "",
    verified: true
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [smtpSettings, setSmtpSettings] = useState({ host: "", port: "", user: "", pass: "", fromEmail: "" });
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);

  const fetchBusinesses = () => {
    fetch("/api/businesses?admin=true")
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

  const fetchSmtpSettings = () => {
    fetch("/api/admin/smtp")
      .then(res => res.json())
      .then(data => {
        setSmtpSettings({
          host: data.host || "",
          port: data.port || "",
          user: data.user || "",
          pass: "", // Don't prefill password
          fromEmail: data.fromEmail || "",
        });
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBusinesses();
      fetchSmtpSettings();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSmtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSmtp(true);
    fetch("/api/admin/smtp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smtpSettings)
    })
    .then(res => res.json())
    .then(() => {
      setIsSavingSmtp(false);
      setShowSettingsForm(false);
      alert("SMTP Settings Saved Successfully.");
    })
    .catch(err => {
      console.error(err);
      setIsSavingSmtp(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/businesses/${editingId}` : "/api/businesses";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save business");
      }
      return res.json();
    })
    .then(() => {
      setIsSubmitting(false);
      setShowAddForm(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchBusinesses();
    })
    .catch(err => {
      console.error(err);
      setIsSubmitting(false);
    });
  };

  const handleToggleVerified = (business: Business) => {
    fetch(`/api/businesses/${business.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...business, verified: !business.verified })
    })
    .then(res => res.json())
    .then(() => fetchBusinesses())
    .catch(err => console.error(err));
  };

  const handleDelete = (id: string, name: string) => {
    fetch(`/api/businesses/${id}`, {
      method: "DELETE"
    })
    .then(() => fetchBusinesses())
    .catch(err => console.error(err));
  };

  const handleEdit = (business: Business) => {
    setEditingId(business.id);
    setFormData({
      name: business.name || "",
      logoUrl: business.logoUrl || "",
      certificateOfIncorporationUrl: business.certificateOfIncorporationUrl || "",
      companyProfileUrl: business.companyProfileUrl || "",
      rcNumber: business.rcNumber || "",
      category: business.category || "",
      services: business.services || "",
      phone: business.phone || "",
      location: business.location || "",
      email: business.email || "",
      website: business.website || "",
      whatsapp: business.whatsapp || "",
      facebookUrl: business.facebookUrl || "",
      instagramUrl: business.instagramUrl || "",
      twitterUrl: business.twitterUrl || "",
      linkedinUrl: business.linkedinUrl || "",
      promoVideoUrl: business.promoVideoUrl || "",
      promoPhoto1Url: business.promoPhoto1Url || "",
      promoPhoto2Url: business.promoPhoto2Url || "",
      verified: business.verified || false
    });
    setShowAddForm(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Admin Dashboard | Nigeria Business Online</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform content and verified businesses</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              if (showSettingsForm) {
                setShowSettingsForm(false);
              } else {
                setShowAddForm(false);
                setShowSettingsForm(true);
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {showSettingsForm ? "Close Settings" : "SMTP Settings"}
          </button>
          <button 
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                setEditingId(null);
              } else {
                setFormData(initialFormState);
                setEditingId(null);
                setShowSettingsForm(false);
                setShowAddForm(true);
              }
            }}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {showAddForm ? "Close Form" : <><Plus size={18} /> Add New Business</>}
          </button>
        </div>
      </div>

      {showSettingsForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
            SMTP Settings
          </h2>
          <form onSubmit={handleSaveSmtp} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                <input required type="text" name="host" value={smtpSettings.host} onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="smtp.gmail.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                <input required type="number" name="port" value={smtpSettings.port} onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="587" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP User</label>
                <input required type="text" name="user" value={smtpSettings.user} onChange={(e) => setSmtpSettings({...smtpSettings, user: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
                <input type="password" name="pass" value={smtpSettings.pass} onChange={(e) => setSmtpSettings({...smtpSettings, pass: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="Leave empty to keep existing password" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">From Email (Optional)</label>
                <input type="email" name="fromEmail" value={smtpSettings.fromEmail} onChange={(e) => setSmtpSettings({...smtpSettings, fromEmail: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" placeholder="notifications@example.com" />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isSavingSmtp}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                {isSavingSmtp ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">
            {editingId ? "Edit Business" : "Direct Entry Form"}
          </h2>
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
                  <option value="Agriculture">Agriculture & Agro-Allied</option>
                  <option value="Arts & Crafts">Arts & Crafts</option>
                  <option value="Automotive">Automotive & Repair</option>
                  <option value="Aviation">Aviation</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Engineering and Construction">Engineering and Construction</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Education">Education & Training</option>
                  <option value="Energy and Power">Energy and Power</option>
                  <option value="Entertainment">Entertainment & Media</option>
                  <option value="Environmental">Environmental Services</option>
                  <option value="Event Management">Event Management Services</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Finance">Financial Services</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Government">Government & Public Services</option>
                  <option value="Healthcare">Healthcare & Pharmaceuticals</option>
                  <option value="Home & Property">Home & Property Services</option>
                  <option value="Hospitality">Hospitality & Tourism</option>
                  <option value="Industrial">Industrial Services</option>
                  <option value="Legal">Legal Services</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Manufacturing">Manufacturing & Production</option>
                  <option value="Marine & Shipping">Marine & Shipping</option>
                  <option value="Marketing">Marketing & Advertising</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Mining">Mining & Solid Minerals</option>
                  <option value="Non-Profit">Non-Profit & NGO</option>
                  <option value="Oil and Gas">Oil and Gas</option>
                  <option value="Printing and Publishing">Printing and Publishing</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Security Services">Security Services</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Technology">Technology & Software</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Transportation & Logistics">Transportation & Logistics</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL (Optional)</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Image)</label>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
                {formData.logoUrl && formData.logoUrl.length > 0 && <span className="text-xs text-green-600 mt-1 block">File selected</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate of Incorporation (Image/PDF)</label>
                <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'certificateOfIncorporationUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
                {formData.certificateOfIncorporationUrl && formData.certificateOfIncorporationUrl.length > 0 && <span className="text-xs text-green-600 mt-1 block">File selected</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Profile (PDF/Word)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, 'companyProfileUrl')} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
                {formData.companyProfileUrl && formData.companyProfileUrl.length > 0 && <span className="text-xs text-green-600 mt-1 block">File selected</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL (Optional)</label>
                <input type="url" name="facebookUrl" value={formData.facebookUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL (Optional)</label>
                <input type="url" name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X (Twitter) URL (Optional)</label>
                <input type="url" name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL (Optional)</label>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Video URL (Optional)</label>
                <input type="url" name="promoVideoUrl" value={formData.promoVideoUrl} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Photo 1 URL (Optional)</label>
                <input type="url" name="promoPhoto1Url" value={formData.promoPhoto1Url} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Photo 2 URL (Optional)</label>
                <input type="url" name="promoPhoto2Url" value={formData.promoPhoto2Url} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-600 outline-none" />
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
          <h2 className="font-bold text-gray-900 text-lg">All Businesses</h2>
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
                      <button 
                        onClick={() => handleToggleVerified(business)}
                        className={`${business.verified ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'} text-sm font-medium mr-4`}
                      >
                        {business.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button 
                        onClick={() => handleEdit(business)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(business.id, business.name)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium mr-4"
                      >
                        Delete
                      </button>
                      <a href={`/business/${business.id}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-800 text-sm font-medium">
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
