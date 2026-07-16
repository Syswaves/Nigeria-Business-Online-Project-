import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

dotenv.config({ override: true });

let smtpConfig = {
  host: process.env.SMTP_HOST || "",
  port: process.env.SMTP_PORT || "",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  fromEmail: process.env.SMTP_FROM_EMAIL || "",
};

const SMTP_FILE = path.join(process.cwd(), "smtp.json");
if (fs.existsSync(SMTP_FILE)) {
  try {
    const savedSmtp = JSON.parse(fs.readFileSync(SMTP_FILE, "utf-8"));
    smtpConfig = { ...smtpConfig, ...savedSmtp };
  } catch (err) {
    console.error("Error reading smtp.json", err);
  }
}

const saveSmtpConfig = () => {
  try {
    fs.writeFileSync(SMTP_FILE, JSON.stringify(smtpConfig, null, 2));
  } catch (err) {
    console.error("Error saving smtp.json", err);
  }
};

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/api/admin/smtp", (req, res) => {
  res.json({
    host: smtpConfig.host,
    port: smtpConfig.port,
    user: smtpConfig.user,
    fromEmail: smtpConfig.fromEmail,
  });
});

app.post("/api/admin/smtp", (req, res) => {
  const { host, port, user, pass, fromEmail } = req.body;
  if (host !== undefined) smtpConfig.host = host;
  if (port !== undefined) smtpConfig.port = port;
  if (user !== undefined) smtpConfig.user = user;
  if (pass !== undefined && pass !== "") smtpConfig.pass = pass;
  if (fromEmail !== undefined) smtpConfig.fromEmail = fromEmail;
  
  saveSmtpConfig();
  res.json({ success: true });
});

interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  rcNumber: string;
  category: string;
  services: string;
  phone: string;
  location: string;
  email: string;
  website?: string;
  whatsapp?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  promoVideoUrl?: string;
  promoPhoto1Url?: string;
  promoPhoto2Url?: string;
  verified?: boolean;
  createdAt: number;
}

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase: any = null;

if (supabaseUrl && supabaseUrl.startsWith("http") && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase connected successfully.");
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
} else {
  console.log("Supabase credentials missing or invalid. Using in-memory fallback.");
}

// In-memory fallback store
let businesses: Business[] = [];
const BUSINESSES_FILE = path.join(process.cwd(), "businesses.json");

if (fs.existsSync(BUSINESSES_FILE)) {
  try {
    businesses = JSON.parse(fs.readFileSync(BUSINESSES_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading businesses.json", err);
  }
}

if (businesses.length === 0) {
  businesses = [
    {
      id: "1",
      name: "TechNova Solutions",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
      rcNumber: "RC123456",
      category: "Information Technology",
      services: "Software Development, Cloud Hosting, IT Consulting",
      phone: "08012345678",
      location: "12, Tech Avenue, Victoria Island, Lagos",
      email: "contact@technova.com.ng",
      website: "https://technova.com.ng",
      whatsapp: "2348012345678",
      promoPhoto1Url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1600&h=400&fit=crop",
      verified: true,
      createdAt: Date.now() - 100000,
    },
    {
      id: "2",
      name: "GreenFields Agro-Allied",
      logoUrl: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?w=100&h=100&fit=crop",
      rcNumber: "RC789012",
      category: "Agriculture",
      services: "Crop Production, Livestock Farming, Agro-processing",
      phone: "08098765432",
      location: "Plot 5, Industrial Estate, Kano",
      email: "info@greenfields.com.ng",
      website: "https://greenfields.com.ng",
      verified: false,
      createdAt: Date.now() - 50000,
    },
    {
      id: "3",
      name: "Zenith Logistics & Supply",
      logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?w=100&h=100&fit=crop",
      rcNumber: "RC345678",
      category: "Logistics",
      services: "Freight Forwarding, Supply Chain Management, Warehousing",
      phone: "07011223344",
      location: "2A, Airport Road, Ikeja, Lagos",
      email: "support@zenithlogistics.ng",
      verified: true,
      createdAt: Date.now(),
    }
  ];
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
}

const saveBusinesses = () => {
  try {
    fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  } catch (err) {
    console.error("Error saving businesses.json", err);
  }
};

// API Endpoints
app.get("/api/businesses", async (req, res) => {
  const query = req.query.q as string;
  const admin = req.query.admin === "true";
  
  if (supabase) {
    let supabaseQuery = supabase.from("businesses").select("*").order("createdAt", { ascending: false });
    
    if (query) {
      const q = query.toLowerCase();
      // Simple OR filter mapping over the relevant columns
      supabaseQuery = supabaseQuery.or(`name.ilike.%${q}%,category.ilike.%${q}%,services.ilike.%${q}%,location.ilike.%${q}%`);
    }

    if (!admin) {
      supabaseQuery = supabaseQuery.eq("verified", true);
    }
    
    const { data, error } = await supabaseQuery;
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to fetch businesses" });
    }
    return res.json(data);
  }

  // Fallback memory
  let result = businesses;
  
  if (!admin) {
    result = result.filter(b => b.verified);
  }
  
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(b => 
      b.name.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.services.toLowerCase().includes(q) ||
      b.location.toLowerCase().includes(q)
    );
  }
  
  // Return sorted by newest first
  res.json(result.sort((a, b) => b.createdAt - a.createdAt));
});

app.get("/api/businesses/latest", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("businesses").select("*").eq("verified", true).order("createdAt", { ascending: false }).limit(3);
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to fetch latest businesses" });
    }
    return res.json(data);
  }

  // Fallback memory
  const latest = [...businesses].filter(b => b.verified).sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
  res.json(latest);
});

app.get("/api/businesses/:id", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("businesses").select("*").eq("id", req.params.id).single();
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(404).json({ error: "Business not found" });
    }
    return res.json(data);
  }

  // Fallback memory
  const business = businesses.find(b => b.id === req.params.id);
  if (business) {
    res.json(business);
  } else {
    res.status(404).json({ error: "Business not found" });
  }
});

app.post("/api/businesses", async (req, res) => {
  const newBusiness = {
    ...req.body,
    createdAt: Date.now()
  };

  let savedBusiness: Business;

  if (supabase) {
    const { data, error } = await supabase.from("businesses").insert([newBusiness]).select().single();
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to create business" });
    }
    savedBusiness = data;
  } else {
    // Fallback memory
    const memoryBusiness: Business = {
      ...newBusiness,
      id: Math.random().toString(36).substr(2, 9),
    };
    businesses.push(memoryBusiness);
    saveBusinesses();
    savedBusiness = memoryBusiness;
  }

  // Send actual email notification if SMTP is configured
  if (smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port || "587"),
        secure: smtpConfig.port === "465",
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      await transporter.sendMail({
        from: smtpConfig.fromEmail || `"Nigeria Business Online" <${smtpConfig.user}>`,
        to: "businessprofiling@nigeriabusinessonline.com",
        subject: `New Business Profiling Submission - ${savedBusiness.name}`,
        text: `A new business has been submitted for profiling.\n\nCompany Name: ${savedBusiness.name}\nEmail: ${savedBusiness.email}\nPhone: ${savedBusiness.phone}\nCategory: ${savedBusiness.category}\nLocation: ${savedBusiness.location}\n\nPlease check the admin dashboard for more details.`,
        html: `<h3>New Business Profiling Submission</h3><p>A new business has been submitted for profiling.</p><ul><li><strong>Company Name:</strong> ${savedBusiness.name}</li><li><strong>Email:</strong> ${savedBusiness.email}</li><li><strong>Phone:</strong> ${savedBusiness.phone}</li><li><strong>Category:</strong> ${savedBusiness.category}</li><li><strong>Location:</strong> ${savedBusiness.location}</li></ul><p>Please check the admin dashboard for more details.</p>`
      });
      console.log(`[EMAIL DISPATCH] Email successfully sent to businessprofiling@nigeriabusinessonline.com`);
    } catch (err) {
      console.error("[EMAIL DISPATCH ERROR] Failed to send email:", err);
    }
  } else {
    // Simulate sending an email notification to businessprofiling@nigeriabusinessonline.com
    console.log("----------------------------------------");
    console.log(`[EMAIL DISPATCH] To: businessprofiling@nigeriabusinessonline.com`);
    console.log(`[EMAIL DISPATCH] Subject: New Business Profiling Submission - ${savedBusiness.name}`);
    console.log(`[EMAIL DISPATCH] Body: A new business has been submitted for profiling.`);
    console.log(`[EMAIL DISPATCH] Company Name: ${savedBusiness.name}`);
    console.log(`[EMAIL DISPATCH] Email: ${savedBusiness.email}`);
    console.log(`[EMAIL DISPATCH] Phone: ${savedBusiness.phone}`);
    console.log("----------------------------------------");
    console.log("[EMAIL NOTE] Provide SMTP credentials in .env to send real emails.");
  }

  res.status(201).json(savedBusiness);
});

app.put("/api/businesses/:id", async (req, res) => {
  const updatedData = { ...req.body };
  delete updatedData.id;

  if (supabase) {
    const { data, error } = await supabase.from("businesses").update(updatedData).eq("id", req.params.id).select().single();
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to update business" });
    }
    return res.json(data);
  }

  // Fallback memory
  const index = businesses.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    businesses[index] = { ...businesses[index], ...updatedData };
    saveBusinesses();
    res.json(businesses[index]);
  } else {
    res.status(404).json({ error: "Business not found" });
  }
});

app.delete("/api/businesses/:id", async (req, res) => {
  if (supabase) {
    const { error } = await supabase.from("businesses").delete().eq("id", req.params.id);
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to delete business" });
    }
    return res.status(204).send();
  }

  // Fallback memory
  const initialLength = businesses.length;
  businesses = businesses.filter(b => b.id !== req.params.id);
  if (businesses.length < initialLength) {
    saveBusinesses();
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Business not found" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
