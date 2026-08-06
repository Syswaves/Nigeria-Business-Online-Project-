const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Replace the businesses variable logic
server = server.replace(
`let businesses: Business[] = [];
const BUSINESSES_FILE = process.env.DATA_FILE_PATH || path.join(process.cwd(), "businesses.json");

if (fs.existsSync(BUSINESSES_FILE)) {
  try {
    businesses = JSON.parse(fs.readFileSync(BUSINESSES_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading businesses.json", err);
  }
}

if (businesses.length === 0) {
  businesses = [`,
`let businesses: Business[] = [];
const BUSINESSES_FILE = process.env.DATA_FILE_PATH || path.join(process.cwd(), "businesses.json");

const loadBusinesses = () => {
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
  businesses = [`
);

server = server.replace(
`const saveBusinesses = () => {
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
};`,
`const saveBusinesses = (data) => {
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
};`
);

// update all the usages
server = server.replace(
  `let result = businesses;`,
  `let result = loadBusinesses();`
);

server = server.replace(
  `businesses.push(memoryBusiness);
    saveBusinesses();`,
  `const allBusinesses = loadBusinesses();
    allBusinesses.push(memoryBusiness);
    saveBusinesses(allBusinesses);`
);

server = server.replace(
  `while (businesses.some(b => b.slug === generatedSlug)) {`,
  `const currentBusinesses = loadBusinesses();
  while (currentBusinesses.some(b => b.slug === generatedSlug)) {`
);

server = server.replace(
  `const index = businesses.findIndex(b => b.id === req.params.id);`,
  `const allBusinesses = loadBusinesses();
  const index = allBusinesses.findIndex(b => b.id === req.params.id);`
);

server = server.replace(
  `businesses[index] = { ...businesses[index], ...updatedData };
    saveBusinesses();
    res.json(businesses[index]);`,
  `allBusinesses[index] = { ...allBusinesses[index], ...updatedData };
    saveBusinesses(allBusinesses);
    res.json(allBusinesses[index]);`
);

server = server.replace(
  `const initialLength = businesses.length;
  businesses = businesses.filter(b => b.id !== req.params.id);
  if (businesses.length < initialLength) {
    saveBusinesses();`,
  `let allBusinesses = loadBusinesses();
  const initialLength = allBusinesses.length;
  allBusinesses = allBusinesses.filter(b => b.id !== req.params.id);
  if (allBusinesses.length < initialLength) {
    saveBusinesses(allBusinesses);`
);

server = server.replace(
  `const index = businesses.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    businesses[index] = { ...businesses[index], ...updatedData };
    saveBusinesses();
    res.json(businesses[index]);
  } else {`,
  `const allBusinesses = loadBusinesses();
  const index = allBusinesses.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    allBusinesses[index] = { ...allBusinesses[index], ...updatedData };
    saveBusinesses(allBusinesses);
    res.json(allBusinesses[index]);
  } else {` // wait, I already replaced this above in two parts, this replace might fail or succeed depending on how I did it. Let's not use it here.
);


fs.writeFileSync('server.ts', server);
