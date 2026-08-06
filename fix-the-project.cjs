const fs = require('fs');
let code = fs.readFileSync('src/pages/TheProject.tsx', 'utf8');

const replacement = `              <h3 className="text-xl font-bold text-gray-900 mb-4">Get Your Business Seen. Trusted. Chosen.</h3>
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
                Create your Business Page Now. Get Discovered. Grow Your Business.
              </p>`;

// Find the two <p> tags
const regex = /<p className="text-lg text-gray-600 mb-6 leading-relaxed">\s*The Nigeria Business Online Project is a comprehensive business profiling platform designed to showcase businesses, companies, and organizations across Nigeria to the world\.\s*<\/p>\s*<p className="text-lg text-gray-600 mb-8 leading-relaxed">\s*It is a centralized hub where potential clients can easily discover, verify, and patronize legitimate Nigerian enterprises\. We provide transparent profiles of businesses complete with services, contact details, and corporate information\. We foster trust and drive economic growth\.\s*<\/p>/;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/pages/TheProject.tsx', code);
    console.log("Success");
} else {
    console.log("Not found");
}

