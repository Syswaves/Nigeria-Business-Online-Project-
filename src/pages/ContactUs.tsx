import React, { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
    window.location.href = `mailto:enquiries@nigeriabusinessonline.com?subject=${encodeURIComponent(formData.subject || "Contact Form Submission")}&body=${body}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col">
      {/* Contact Section */}
      <section className="py-20 bg-gray-50 flex-1">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Have questions or need assistance profiling your business? Our team is here to help you get started.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Email Enquiries</p>
                    <a href="mailto:enquiries@nigeriabusinessonline.com" className="text-lg font-medium text-green-700 hover:text-green-800 break-words">
                      enquiries@nigeriabusinessonline.com
                    </a>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">WhatsApp Support</p>
                    <a href="https://wa.me/2348071087326" target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-green-700 hover:text-green-800">
                      +234 807 108 7326
                    </a>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Abuja</p>
                    <p className="text-base font-medium text-gray-900">
                      Suite 45 (GOD S OWN PLAZA EXTENSION) Plot 1037 Takum Close Area 11, Garki, Abuja
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Port Harcourt</p>
                    <p className="text-base font-medium text-gray-900">
                      33 Eastern By-Pass Road, Rivers State, Nigeria
                    </p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      +234 803 705 8540, +234 807 108 7326
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-colors resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                  >
                    Submit Message
                  </button>
                </form>
              </div>
            </div>
         </div>
      </section>
    </div>
  );
}
