import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Hash, Briefcase, BadgeCheck, MessageCircle } from "lucide-react";
import type { Business } from "../types";
import { Helmet } from "react-helmet-async";

export default function BusinessProfile() {
  const { id } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/businesses/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setBusiness(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center">Loading profile...</div>;
  }

  if (!business) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Helmet>
          <title>Business Not Found | Nigeria Business Online</title>
        </Helmet>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Business not found</h2>
        <Link to="/" className="text-green-700 font-medium hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{business.name} | Nigeria Business Online</title>
        <meta name="description" content={`View the business profile of ${business.name}, categorized under ${business.category}. ${business.services}`} />
      </Helmet>
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-700 transition-colors mb-8 font-medium">
        <ArrowLeft size={20} /> Back to Profiles
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Cover */}
        <div className={`h-64 relative overflow-hidden ${!(business.promoPhoto1Url || business.promoPhoto2Url) ? 'bg-gradient-to-r from-green-800 to-green-600' : 'bg-gray-100'}`}>
          {(business.promoPhoto1Url || business.promoPhoto2Url) && (
            <img 
              src={business.promoPhoto1Url || business.promoPhoto2Url} 
              alt={`${business.name} cover`} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="-mt-16 w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0 relative z-10 flex items-center justify-center">
               {business.logoUrl ? (
                  <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-green-50 text-green-700 flex items-center justify-center text-4xl font-bold">
                    {business.name.charAt(0)}
                  </div>
                )}
            </div>
            
            <div className="pt-4 flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {business.name}
                    {business.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100 align-middle">
                        <BadgeCheck size={14} className="text-blue-600" /> Verified
                      </span>
                    )}
                  </h1>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {business.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
            
            {/* Main Content */}
            <div className="md:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">About & Services</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {business.services}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Company Information</h2>
                <div className="flex items-center gap-3 text-gray-700 mb-3">
                  <Hash className="text-gray-400" size={20} />
                  <span><strong>RC/BN Number:</strong> {business.rcNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Briefcase className="text-gray-400" size={20} />
                  <span>
                    <strong>Verified Status:</strong>{" "}
                    {business.verified ? (
                      <span className="text-blue-600 font-semibold flex items-center gap-1 inline-flex">
                        <BadgeCheck size={16} /> Verified
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">Pending Verification</span>
                    )}
                  </span>
                </div>
              </div>

              {business.promoVideoUrl && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Promotional Video</h2>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100">
                    <iframe 
                      src={business.promoVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                      title="Promotional Video" 
                      className="w-full h-full border-0" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Contact Details</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4 text-gray-700">
                  <MapPin className="text-green-700 mt-1 flex-shrink-0" size={20} />
                  <span>{business.location}</span>
                </li>
                <li className="flex items-center gap-4 text-gray-700">
                  <Phone className="text-green-700 flex-shrink-0" size={20} />
                  <a href={`tel:${business.phone}`} className="hover:text-green-700">{business.phone}</a>
                </li>
                {business.whatsapp && (
                  <li className="flex items-center gap-4 text-gray-700">
                    <MessageCircle className="text-green-700 flex-shrink-0" size={20} />
                    <a href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-700">
                      Chat on WhatsApp
                    </a>
                  </li>
                )}
                <li className="flex items-center gap-4 text-gray-700">
                  <Mail className="text-green-700 flex-shrink-0" size={20} />
                  <a href={`mailto:${business.email}`} className="hover:text-green-700 break-all">{business.email}</a>
                </li>
                {business.website && (
                  <li className="flex items-center gap-4 text-gray-700">
                    <Globe className="text-green-700 flex-shrink-0" size={20} />
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-700 break-all">
                      {business.website.replace(/^https?:\/\//, '')}
                    </a>
                  </li>
                )}
              </ul>

              {/* Social Media Links */}
              {(business.facebookUrl || business.instagramUrl || business.twitterUrl || business.linkedinUrl) && (
                <>
                  <h3 className="font-bold text-gray-900 mb-6 mt-10 text-lg border-t border-gray-200 pt-6">Social Media</h3>
                  <ul className="space-y-4">
                    {business.facebookUrl && (
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">f</div>
                        <a href={business.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all text-sm font-medium">Facebook</a>
                      </li>
                    )}
                    {business.instagramUrl && (
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 text-pink-600 font-bold">ig</div>
                        <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline break-all text-sm font-medium">Instagram</a>
                      </li>
                    )}
                    {business.twitterUrl && (
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-800 font-bold">X</div>
                        <a href={business.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline break-all text-sm font-medium">X (Twitter)</a>
                      </li>
                    )}
                    {business.linkedinUrl && (
                      <li className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">in</div>
                        <a href={business.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all text-sm font-medium">LinkedIn</a>
                      </li>
                    )}
                  </ul>
                </>
              )}

              {/* Documents */}
              {(business.companyProfileUrl || business.certificateOfIncorporationUrl) && (
                <>
                  <h3 className="font-bold text-gray-900 mb-6 mt-10 text-lg border-t border-gray-200 pt-6">Documents</h3>
                  <div className="space-y-4">
                    {business.companyProfileUrl && (
                      <a href={business.companyProfileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-green-600 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-700 flex-shrink-0">
                          <Briefcase size={20} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">Company Profile</div>
                      </a>
                    )}
                    {business.certificateOfIncorporationUrl && (
                      <a href={business.certificateOfIncorporationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-green-600 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 flex-shrink-0">
                          <BadgeCheck size={20} />
                        </div>
                        <div className="text-sm font-medium text-gray-900">Certificate of Incorporation</div>
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
