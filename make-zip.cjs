const AdmZip = require('adm-zip');
const zip = new AdmZip();

// Add dist folder
zip.addLocalFolder('dist', 'dist');

// Add specific files
zip.addLocalFile('package.json');
zip.addLocalFile('.npmrc');

// Write zip
zip.writeZip('public/deploy.zip');
console.log("Created deploy.zip in public/");
