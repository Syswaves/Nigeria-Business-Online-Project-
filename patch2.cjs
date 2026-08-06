const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Replace loadBusinesses logic back to memory-based
server = server.replace(
`const loadBusinesses = () => {
  if (fs.existsSync(BUSINESSES_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BUSINESSES_FILE, "utf-8"));
    } catch (err) {
      console.error("Error reading businesses.json", err);
    }
  }
  return [];
};

if (!fs.existsSync(BUSINESSES_FILE) || loadBusinesses().length === 0) {
  businesses = [`,
`const loadBusinesses = () => {
  if (fs.existsSync(BUSINESSES_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(BUSINESSES_FILE, "utf-8"));
      if (data && data.length > 0) {
        businesses = data;
      }
    } catch (err) {
      console.error("Error reading businesses.json", err);
    }
  }
};

loadBusinesses();

if (businesses.length === 0) {
  businesses = [`
);

// We need to fix the usages where loadBusinesses() was used to return an array,
// but now loadBusinesses() returns void and sets the global array.
server = server.replace(/let result = loadBusinesses\(\);/g, `let result = businesses;`);
server = server.replace(/const allBusinesses = loadBusinesses\(\);/g, ``); // remove this line
server = server.replace(/allBusinesses/g, `businesses`); // replace allBusinesses with businesses
server = server.replace(/const currentBusinesses = loadBusinesses\(\);/g, ``);
server = server.replace(/currentBusinesses/g, `businesses`);
server = server.replace(/let businesses = loadBusinesses\(\);/g, ``); // if we had this

// Ensure saveBusinesses() takes no arguments again
server = server.replace(
`const saveBusinesses = (data) => {
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
};`,
`const saveBusinesses = () => {
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
};`
);

// Add the download route
if (!server.includes('/api/download-deploy')) {
  server = server.replace(
    `app.listen(PORT, "0.0.0.0", () => {`,
    `app.get('/api/download-deploy', (req, res) => {
    const file = path.join(process.cwd(), 'public', 'deploy.zip');
    if (fs.existsSync(file)) {
      res.download(file, 'deploy.zip');
    } else {
      res.status(404).send('Deployment package not found.');
    }
  });

  app.listen(PORT, "0.0.0.0", () => {`
  );
}

fs.writeFileSync('server.ts', server);
