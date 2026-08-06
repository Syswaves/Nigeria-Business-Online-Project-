const fs = require('fs');

let server = fs.readFileSync('server.ts', 'utf8');

// Remove the wrongly placed route at the bottom
server = server.replace(
  `app.get('/api/download-deploy', (req, res) => {
    const file = path.join(process.cwd(), 'public', 'deploy.zip');
    if (fs.existsSync(file)) {
      res.download(file, 'deploy.zip');
    } else {
      res.status(404).send('Deployment package not found.');
    }
  });`,
  ``
);

const insertionPoint = `app.use(express.urlencoded({ limit: "50mb", extended: true }));`;

const newRoutes = `
app.get(['/deploy.zip', '/api/download-deploy'], (req, res) => {
  const file = path.join(process.cwd(), 'public', 'deploy.zip');
  if (fs.existsSync(file)) {
    // Set headers to force download
    res.setHeader('Content-Disposition', 'attachment; filename="deploy.zip"');
    res.setHeader('Content-Type', 'application/zip');
    const fileStream = fs.createReadStream(file);
    fileStream.pipe(res);
  } else {
    res.status(404).send('Deployment package not found. Please wait or trigger a new build.');
  }
});
`;

server = server.replace(insertionPoint, insertionPoint + newRoutes);

fs.writeFileSync('server.ts', server);
