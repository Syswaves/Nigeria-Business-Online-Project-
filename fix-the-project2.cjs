const fs = require('fs');
let code = fs.readFileSync('src/pages/TheProject.tsx', 'utf8');

code = code.replace(/Create your Business Page Now\. Get Discovered\. Grow Your Business\./g, 'Get Discovered. Grow Your Business.');
code = code.replace(/>\s*Add Your Business\s*<\/Link>/, '>\n                  Create your Business Page Now\n                </Link>');

fs.writeFileSync('src/pages/TheProject.tsx', code);
