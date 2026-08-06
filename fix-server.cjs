const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/logger: true\n\s*\},/g, 'logger: true,');
fs.writeFileSync('server.ts', code);
