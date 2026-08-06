import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import fs from "fs";

dotenv.config({ override: true });

function cleanSmtpHost(host: string) {
  if (!host) return "";
  try {
    // If it has a scheme, parse it using URL
    if (host.includes("://")) {
      const url = new URL(host);
      return url.hostname;
    }
    // Remove port if present
    return host.split(":")[0];
  } catch (err) {
    return host;
  }
}

let smtpConfig = {
  host: cleanSmtpHost(process.env.SMTP_HOST || ""),
  port: process.env.SMTP_PORT || "",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASS || "",
  fromEmail: process.env.SMTP_FROM_EMAIL || "",
};

const SMTP_FILE = path.join(process.cwd(), "smtp.json");
if (fs.existsSync(SMTP_FILE)) {
  try {
    const savedSmtp = JSON.parse(fs.readFileSync(SMTP_FILE, "utf-8"));
    if (savedSmtp.host) {
      savedSmtp.host = cleanSmtpHost(savedSmtp.host);
    }
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
  if (host !== undefined) smtpConfig.host = cleanSmtpHost(host);
  if (port !== undefined) smtpConfig.port = port;
  if (user !== undefined) smtpConfig.user = user;
  if (pass !== undefined && pass !== "") smtpConfig.pass = pass;
  if (fromEmail !== undefined) smtpConfig.fromEmail = fromEmail;
  
  saveSmtpConfig();
  res.json({ success: true });
});

interface Business {
  id: string;
  slug?: string;
  name: string;
  slogan?: string;
  logoUrl?: string;
  certificateOfIncorporationUrl?: string;
  companyProfileUrl?: string;
  rcNumber: string;
  category: string;
  aboutUs?: string;
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
  promoPhoto3Url?: string;
  promoPhoto4Url?: string;
  promoPhoto5Url?: string;
  username?: string;
  password?: string;
  verified?: boolean;
  verifiedAt?: number | null;
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
const BUSINESSES_FILE = process.env.DATA_FILE_PATH || path.join(process.cwd(), "businesses.json");

const loadBusinesses = () => {
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
      verifiedAt: Date.now() - 100000,
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
      verifiedAt: Date.now(),
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
      const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      supabaseQuery = supabaseQuery.eq("verified", true).gte("verifiedAt", oneYearAgo);
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
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    result = result.filter(b => b.verified && b.verifiedAt && b.verifiedAt >= oneYearAgo);
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
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const { data, error } = await supabase.from("businesses")
      .select("*")
      .eq("verified", true)
      .gte("verifiedAt", oneYearAgo)
      .order("createdAt", { ascending: false })
      .limit(3);
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to fetch latest businesses" });
    }
    return res.json(data);
  }

  // Fallback memory
  const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
  const latest = [...businesses]
    .filter(b => b.verified && b.verifiedAt && b.verifiedAt >= oneYearAgo)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);
  res.json(latest);
});

app.get("/api/businesses/:id", async (req, res) => {
  const param = req.params.id;
  if (supabase) {
    let { data, error } = await supabase.from("businesses").select("*").eq("slug", param).single();
    if (error || !data) {
      const res2 = await supabase.from("businesses").select("*").eq("id", param).single();
      data = res2.data;
      error = res2.error;
    }
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(404).json({ error: "Business not found" });
    }
    return res.json(data);
  }

  // Fallback memory
  const business = businesses.find(b => b.slug === param || b.id === param);
  if (business) {
    res.json(business);
  } else {
    res.status(404).json({ error: "Business not found" });
  }
});

app.post("/api/businesses", async (req, res) => {
  const baseSlug = (req.body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let generatedSlug = baseSlug || "business";
  
  // Basic collision check for local memory
  let counter = 1;
  
  while (businesses.some(b => b.slug === generatedSlug)) {
    generatedSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  const newBusiness = {
    ...req.body,
    slug: generatedSlug,
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
      console.log("Creating transport with config:", { host: smtpConfig.host, port: smtpConfig.port, secure: String(smtpConfig.port) === "465" });
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port || "587"),
        secure: String(smtpConfig.port) === "465",
        tls: {
          rejectUnauthorized: false
        },
        debug: true,
        logger: true,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

            const attachments: any[] = [];
      const addAttachment = (url: string | undefined, filename: string) => {
        if (url && url.startsWith('data:')) {
          const match = url.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            let ext = match[1].split('/')[1] || 'bin';
            if (ext === 'jpeg') ext = 'jpg';
            if (ext === 'vnd.openxmlformats-officedocument.wordprocessingml.document') ext = 'docx';
            if (ext === 'msword') ext = 'doc';
            attachments.push({
              filename: `${filename}.${ext}`,
              content: match[2],
              encoding: 'base64'
            });
          }
        } else if (url) {
          attachments.push({
             filename: filename,
             path: url
          });
        }
      };
      
      addAttachment(savedBusiness.logoUrl, 'logo');
      addAttachment(savedBusiness.certificateOfIncorporationUrl, 'certificate');
      addAttachment(savedBusiness.companyProfileUrl, 'company-profile');
      addAttachment(savedBusiness.promoVideoUrl, 'promo-video');
      addAttachment(savedBusiness.promoPhoto1Url, 'promo-photo-1');
      addAttachment(savedBusiness.promoPhoto2Url, 'promo-photo-2');
      addAttachment(savedBusiness.promoPhoto3Url, 'promo-photo-3');
      addAttachment(savedBusiness.promoPhoto4Url, 'promo-photo-4');
      addAttachment(savedBusiness.promoPhoto5Url, 'promo-photo-5');
      
      await transporter.sendMail({
        from: smtpConfig.fromEmail || `"Nigeria Business Online" <${smtpConfig.user}>`,
        to: "businessprofiling@nigeriabusinessonline.com",
        cc: "nigeriabusinessonlineproject@gmail.com",
        subject: `New Business Profiling Submission - ${savedBusiness.name}`,
        attachments,
        text: `A new business has been submitted for profiling.

` +
          `Company Name: ${savedBusiness.name || 'N/A'}
` +
          `RC Number: ${savedBusiness.rcNumber || 'N/A'}
` +
          `Category: ${savedBusiness.category || 'N/A'}
` +
          `Email: ${savedBusiness.email || 'N/A'}
` +
          `Phone: ${savedBusiness.phone || 'N/A'}
` +
          `WhatsApp: ${savedBusiness.whatsapp || 'N/A'}
` +
          `Location: ${savedBusiness.location || 'N/A'}
` +
          `Website: ${savedBusiness.website || 'N/A'}
` +
          `Slogan: ${savedBusiness.slogan || 'N/A'}
` +
          `About Us: ${savedBusiness.aboutUs || 'N/A'}
` +
          `Services: ${savedBusiness.services || 'N/A'}
` +
          `Facebook: ${savedBusiness.facebookUrl || 'N/A'}
` +
          `Instagram: ${savedBusiness.instagramUrl || 'N/A'}
` +
          `Twitter: ${savedBusiness.twitterUrl || 'N/A'}
` +
          `LinkedIn: ${savedBusiness.linkedinUrl || 'N/A'}

` +
          `Please check the admin dashboard for more details and see the attached files.`,
        html: `<h3>New Business Profiling Submission</h3>
<p>A new business has been submitted for profiling.</p>
<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 800px;">
  <tr><td><strong>Company Name:</strong></td><td>${savedBusiness.name || 'N/A'}</td></tr>
  <tr><td><strong>RC Number:</strong></td><td>${savedBusiness.rcNumber || 'N/A'}</td></tr>
  <tr><td><strong>Category:</strong></td><td>${savedBusiness.category || 'N/A'}</td></tr>
  <tr><td><strong>Email:</strong></td><td>${savedBusiness.email || 'N/A'}</td></tr>
  <tr><td><strong>Phone:</strong></td><td>${savedBusiness.phone || 'N/A'}</td></tr>
  <tr><td><strong>WhatsApp:</strong></td><td>${savedBusiness.whatsapp || 'N/A'}</td></tr>
  <tr><td><strong>Location:</strong></td><td>${savedBusiness.location || 'N/A'}</td></tr>
  <tr><td><strong>Website:</strong></td><td>${savedBusiness.website || 'N/A'}</td></tr>
  <tr><td><strong>Slogan:</strong></td><td>${savedBusiness.slogan || 'N/A'}</td></tr>
  <tr><td><strong>About Us:</strong></td><td>${savedBusiness.aboutUs || 'N/A'}</td></tr>
  <tr><td><strong>Services:</strong></td><td>${savedBusiness.services || 'N/A'}</td></tr>
  <tr><td><strong>Facebook:</strong></td><td>${savedBusiness.facebookUrl || 'N/A'}</td></tr>
  <tr><td><strong>Instagram:</strong></td><td>${savedBusiness.instagramUrl || 'N/A'}</td></tr>
  <tr><td><strong>Twitter:</strong></td><td>${savedBusiness.twitterUrl || 'N/A'}</td></tr>
  <tr><td><strong>LinkedIn:</strong></td><td>${savedBusiness.linkedinUrl || 'N/A'}</td></tr>
</table>
<h4>Uploaded Documents</h4>
<p>${attachments.length > 0 ? attachments.length + " file(s) have been attached to this email." : "No files were uploaded."}</p>
<p>Please check the admin dashboard for more details.</p>`
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

app.post("/api/business/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (supabase) {
    const { data, error } = await supabase.from("businesses").select("*").eq("username", username).eq("password", password).single();
    if (error || !data) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    return res.json(data);
  }

  // Fallback memory
  const business = businesses.find(b => b.username === username && b.password === password);
  if (business) {
    res.json(business);
  } else {
    res.status(401).json({ error: "Invalid username or password" });
  }
});

app.post("/api/business/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  let business;
  if (supabase) {
    const { data } = await supabase.from("businesses").select("*").eq("email", email).single();
    business = data;
  } else {
    business = businesses.find(b => b.email === email);
  }

  if (business && smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
    try {
      console.log("Creating transport with config:", { host: smtpConfig.host, port: smtpConfig.port, secure: String(smtpConfig.port) === "465" });
      const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: parseInt(smtpConfig.port || "587"),
        secure: String(smtpConfig.port) === "465",
        tls: {
          rejectUnauthorized: false
        },
        debug: true,
        logger: true,
        auth: {
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        },
      });

      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;

      await transporter.sendMail({
        from: smtpConfig.fromEmail || smtpConfig.user,
        to: business.email,
        subject: "Your Business Dashboard Login Details",
        html: `
          <h2>Login Details Recovery</h2>
          <p>You requested to recover your login details for your Nigeria Business Online dashboard.</p>
          <br/>
          <p><strong>Dashboard Login Details:</strong></p>
          <ul>
            <li><strong>Username:</strong> ${business.username}</li>
            <li><strong>Password:</strong> ${business.password}</li>
          </ul>
          <p>Login URL: <a href="${baseUrl}/business-dashboard">${baseUrl}/business-dashboard</a></p>
          <br/>
          <p>If you did not request this, please ignore this email.</p>
        `
      });
    } catch (err) {
      console.error("Failed to send forgot password email:", err);
    }
  }

  // Always return success to prevent email enumeration
  return res.json({ success: true });
});

app.put("/api/businesses/:id", async (req, res) => {
  const updatedData = { ...req.body };
  delete updatedData.id;

  // Send an email if a new username/password is generated (verified)
  if (updatedData.username && updatedData.password && updatedData.verified) {
    // Only if SMTP is configured
    if (smtpConfig.host && smtpConfig.user && smtpConfig.pass) {
      try {
        console.log("Creating transport with config:", { host: smtpConfig.host, port: smtpConfig.port, secure: String(smtpConfig.port) === "465" });
      const transporter = nodemailer.createTransport({
          host: smtpConfig.host,
          port: parseInt(smtpConfig.port || "587"),
          secure: String(smtpConfig.port) === "465",
        tls: {
          rejectUnauthorized: false
        },
        debug: true,
        logger: true,
          auth: {
            user: smtpConfig.user,
            pass: smtpConfig.pass,
          },
        });

        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
        const profileUrl = `${baseUrl}/business/${req.params.id}`;

        await transporter.sendMail({
          from: smtpConfig.fromEmail || smtpConfig.user,
          to: updatedData.email,
          subject: "Your Business Profile is Verified!",
          html: `
            <h2>Congratulations!</h2>
            <p>Your business profile for <strong>${updatedData.name}</strong> has been verified on Nigeria Business Online.</p>
            <p>You can view your published profile here: <a href="${profileUrl}">${profileUrl}</a></p>
            <p>You can also log in to your dashboard to make updates to your profile anytime.</p>
            <br/>
            <p><strong>Dashboard Login Details:</strong></p>
            <p>Username: <strong>${updatedData.username}</strong></p>
            <p>Password: <strong>${updatedData.password}</strong></p>
            <br/>
            <p>Please keep these credentials safe.</p>
            <p>Best regards,</p>
            <p>Nigeria Business Online Team</p>
          `
        });
        console.log(`Verification email with credentials sent to ${updatedData.email}`);
      } catch (err) {
        console.error("Failed to send verification email:", err);
      }
    }
  }

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

const sendExpirationReminders = async () => {
  console.log("Checking for businesses requiring expiration reminders...");
  if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.pass) {
    console.log("SMTP not configured, skipping reminders.");
    return;
  }
  
  try {
    console.log("Creating transport with config:", { host: smtpConfig.host, port: smtpConfig.port, secure: String(smtpConfig.port) === "465" });
      const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: parseInt(smtpConfig.port || "587"),
      secure: String(smtpConfig.port) === "465",
        tls: {
          rejectUnauthorized: false
        },
        debug: true,
        logger: true,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    const now = Date.now();
    
    let businesses: Business[] = [];
    if (supabase) {
      const { data } = await supabase.from("businesses").select("*").eq("verified", true);
      if (data) businesses = data;
    } else {
      businesses = businesses.filter(b => b.verified);
    }
    
    for (const b of businesses) {
      if (!b.verifiedAt) continue;
      
      const expirationDate = b.verifiedAt + 365 * 24 * 60 * 60 * 1000;
      const msUntilExpiration = expirationDate - now;
      
      // Check if it's within the 2 month window (e.g. between 59 and 60 days)
      if (msUntilExpiration > 59 * 24 * 60 * 60 * 1000 && msUntilExpiration <= 60 * 24 * 60 * 60 * 1000) {
        console.log(`Sending reminder to ${b.name} (${b.email})`);
        
        await transporter.sendMail({
          from: smtpConfig.fromEmail || smtpConfig.user,
          to: b.email,
          subject: "Notice: Your Business Subscription Expires in 2 Months",
          html: `
            <h2>Subscription Expiration Reminder</h2>
            <p>Dear ${b.name},</p>
            <p>This is a reminder that your verified business listing on <strong>Nigeria Business Online</strong> will expire on <strong>${new Date(expirationDate).toLocaleDateString()}</strong> (in approximately 2 months).</p>
            <p>Please contact the administration to renew your subscription and maintain your verified visibility on our platform.</p>
            <br/>
            <p>Best regards,</p>
            <p>Nigeria Business Online Team</p>
          `
        });
      }
    }
  } catch (error) {
    console.error("Failed to send reminders:", error);
  }
};

// Run once a day
setInterval(sendExpirationReminders, 24 * 60 * 60 * 1000);
// Also run on startup
setTimeout(sendExpirationReminders, 5000);

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Under some environments like cPanel/Passenger, process.cwd() might not point to the project root.
    // Since this runs from dist/server.cjs in production, __dirname is the dist/ directory.
    const distPath = __dirname;
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}\nData file path: ${BUSINESSES_FILE}`);
  });
}

startServer();
