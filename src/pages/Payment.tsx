import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, CheckCircle, ShieldCheck, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { usePaystackPayment } from "react-paystack";

export default function Payment() {
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const amount = 1000 * 100; // 1,000 NGN in kobo

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: amount, 
    publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    metadata: {
      custom_fields: [
        {
          display_name: "Business Name",
          variable_name: "business_name",
          value: businessName,
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log(reference);
    alert("Payment complete! Reference: " + reference.reference);
  };

  const onClose = () => {
    console.log('Payment closed');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !businessName) {
      alert("Please enter your business name and email address to proceed with payment.");
      return;
    }
    initializePayment({ onSuccess, onClose });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
      <Helmet>
        <title>Payment | Nigeria Business Online</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard size={40} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Complete Your Business Profiling</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your business profile has been approved! Complete your payment to publish your profile and get your "Verified" badge.
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
        <div className="p-8 sm:p-12">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Publication Fee</h2>
            <div className="text-3xl font-bold text-gray-900 mb-2">₦1,000</div>
            <div className="text-sm text-gray-500 mb-6">Per year</div>
            
            <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">What's included:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Public business profile listing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Official "Verified" badge on your profile</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Improved visibility in search results</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700">Access to business dashboard</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handlePayment} className="w-full space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1 text-left">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your  business name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered business email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-green-700 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-green-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Proceed to Payment <ArrowRight size={20} />
              </button>
            </form>
            
            <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
              <ShieldCheck size={16} className="text-gray-400" />
              <span>Secure payment powered by Paystack</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>After successful payment, our team will confirm the transaction and publish your verified profile and create your business page.</p>
        <p className="mt-2">Need help? <Link to="/contact" className="text-green-700 hover:underline">Contact Support</Link></p>
      </div>
    </div>
  );
}
