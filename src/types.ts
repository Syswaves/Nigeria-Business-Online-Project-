export interface Business {
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
