const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const oldText = `<p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-light">
                Promoting trust, growth and visibility for Nigerian Businesses. Create your Business Page / Profile  on Nigeria's Exclusive Business web platform NOW and expand your reach.. .   Connect with verified businesses and get top notch products and service delivery
              </p>`;

const newText = `<ul className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-light space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></span>
                  <span>Join Nigeria's growing network of confirmed businesses. Increase your visibility, build customer trust, and unlock new opportunities.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></span>
                  <span>Connect with confirmed businesses and get top notch products and service delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></span>
                  <span>Create your business page today and start getting discovered.</span>
                </li>
              </ul>`;

if (code.includes(oldText)) {
  code = code.replace(oldText, newText);
  fs.writeFileSync('src/pages/Home.tsx', code);
  console.log("Success");
} else {
  console.log("Not found exact string, using regex");
  const regex = /<p[^>]*>\s*Promoting trust, growth and visibility[\s\S]*?<\/p>/;
  if (regex.test(code)) {
    code = code.replace(regex, newText);
    fs.writeFileSync('src/pages/Home.tsx', code);
    console.log("Success with regex");
  } else {
    console.log("Not found with regex either.");
  }
}
