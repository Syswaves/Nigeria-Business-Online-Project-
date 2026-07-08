import { Upload, Mail, Briefcase, MapPin, Phone, Hash, CheckCircle, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function AddBusiness() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);

    // In a real app, this would submit via an API that sends an email to:
    // businessprofiling@nigeriabusinessonline.com
  };

  if (submitSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Business Profile Submitted</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Thank you for submitting your business for profiling with Nigeria Business Online Project. Your application and documents have been received.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-8 mb-10 max-w-2xl mx-auto text-left">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">What happens next?</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">1</div>
                <p>Our verification team will review your submitted profile and documents within 48 hours.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">2</div>
                <p>You will receive an email at the provided address detailing the status of your verification.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">3</div>
                <p>Once approved, your business will be published to the public directory with a "Verified" badge.</p>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/"
              className="w-full sm:w-auto bg-green-700 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-green-800 transition-colors inline-flex items-center justify-center gap-2"
            >
              Back to Home <ArrowRight size={18} />
            </Link>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Submit Another Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Add Your Business</h1>
        <p className="text-lg text-gray-600">
          Fill out the form below to profile your company on our platform. 
          Please ensure all provided information is accurate and documents are clear.
          Your application will be processed and verified before publishing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        
        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Briefcase className="text-green-700" size={20} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Business / Company / Organisation Name *</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. Zenith Tech Solutions Ltd" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">RC / BN Number *</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. RC123456" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category / Type of Business *</label>
                <select required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none bg-white">
                  <option value="">Select Category</option>
                  <option value="Agriculture">Agriculture & Agro-Allied</option>
                  <option value="Technology">Technology & Software</option>
                  <option value="Logistics">Logistics & Transportation</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail & E-commerce</option>
                  <option value="Services">Professional Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Services Rendered *</label>
                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none resize-none" placeholder="Briefly describe the products or services your company offers..."></textarea>
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
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. 08012345678, 07087654321" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input required type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="contact@company.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number (Optional)</label>
                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. 2348012345678" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location / Address(es) *</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="Full office address" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="https://www.yourcompany.com" />
              </div>
            </div>
          </div>

          {/* Social Media & Media */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Hash className="text-green-700" size={20} /> Social Media & Promotions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Handle (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. @yourcompany" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Handle (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. @yourcompany" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">X (Twitter) Handle (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. @yourcompany" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel (Optional)</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. Your Company Channel" />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promotional Video URL (Optional)</label>
                <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" placeholder="e.g. https://youtube.com/watch?v=..." />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Upload className="text-green-700" size={20} /> Documents & Media
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo *</label>
                <p className="text-xs text-gray-500 mb-3">JPG, PNG (Max 2MB)</p>
                <input required type="file" accept="image/*" className="text-sm text-gray-500 w-full" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate of Incorporation (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">JPG, PDF (Max 5MB)</p>
                <input type="file" accept=".pdf,image/*" className="text-sm text-gray-500 w-full" />
              </div>

              <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Profile (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">PDF or WORD FORMAT (Max 10MB)</p>
                <input type="file" accept=".pdf,.doc,.docx" className="text-sm text-gray-500 w-full" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Photo 1 (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">JPG, PNG (Max 5MB)</p>
                <input type="file" accept="image/*" className="text-sm text-gray-500 w-full" />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto text-gray-400 mb-3" size={24} />
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotional Photo 2 (Optional)</label>
                <p className="text-xs text-gray-500 mb-3">JPG, PNG (Max 5MB)</p>
                <input type="file" accept="image/*" className="text-sm text-gray-500 w-full" />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-6 text-center">
            By submitting this form, you confirm that all information provided is accurate and you authorize Nigeria Business Online Project to publish this information. All submissions are sent to <strong className="text-gray-700">businessprofiling@nigeriabusinessonline.com</strong>
          </p>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Business Profile"}
          </button>
        </div>

      </form>
    </div>
  );
}
