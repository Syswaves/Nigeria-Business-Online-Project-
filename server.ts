import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
  xUrl?: string;
  youtubeUrl?: string;
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
let businesses: Business[] = [
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

// API Endpoints
app.get("/api/businesses", async (req, res) => {
  const query = req.query.q as string;
  
  if (supabase) {
    let supabaseQuery = supabase.from("businesses").select("*").order("createdAt", { ascending: false });
    
    if (query) {
      const q = query.toLowerCase();
      // Simple OR filter mapping over the relevant columns
      supabaseQuery = supabaseQuery.or(`name.ilike.%${q}%,category.ilike.%${q}%,services.ilike.%${q}%,location.ilike.%${q}%`);
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
  
  if (query) {
    const q = query.toLowerCase();
    result = businesses.filter(b => 
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
    const { data, error } = await supabase.from("businesses").select("*").order("createdAt", { ascending: false }).limit(3);
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to fetch latest businesses" });
    }
    return res.json(data);
  }

  // Fallback memory
  const latest = [...businesses].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
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

  if (supabase) {
    const { data, error } = await supabase.from("businesses").insert([newBusiness]).select().single();
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Failed to create business" });
    }
    return res.status(201).json(data);
  }

  // Fallback memory
  const memoryBusiness: Business = {
    ...newBusiness,
    id: Math.random().toString(36).substr(2, 9),
  };
  businesses.push(memoryBusiness);
  res.status(201).json(memoryBusiness);
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
