const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

code = code.replace(
  `{showSettingsForm ? "Close Settings" : "SMTP Settings"}
          </button>
          <a href="/deploy.zip" target="_blank" download className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
            Download Deploy ZIP
          </button>`,
  `{showSettingsForm ? "Close Settings" : "SMTP Settings"}
          </button>
          <a href="/deploy.zip" target="_blank" download className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
            Download Deploy ZIP
          </a>`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
