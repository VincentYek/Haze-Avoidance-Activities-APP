import { SingaporeRegion } from './haze';

export type NightspotCategory =
  | 'Speakeasy & Cocktail Bar'
  | 'Live Music & Jazz Lounge'
  | 'Mega Nightclub & Dance'
  | 'Arcade & Social Entertainment'
  | 'Enclosed Sky Lounge';

export type DressCode =
  | 'Smart Casual'
  | 'Upscale / Glamorous'
  | 'Club Chic'
  | 'Casual / Neat';

export type NightspotShelter =
  | 'HEPA-Filtered Indoor Complex'
  | 'Subterranean Speakeasy (Zero Outdoor Exposure)'
  | 'Fully Enclosed Air-Conditioned Shophouse'
  | 'High-Altitude Sealed Sky Lounge';

export interface SignatureCocktailOrPerk {
  name: string;
  description: string;
  priceSgd: string;
  isHighlight: boolean;
}

export interface Nightspot {
  id: string;
  name: string;
  category: NightspotCategory;
  subTitle: string;
  vibe: string;
  rating: number;
  reviewCount: number;
  priceTier: '$$' | '$$$' | '$$$$';
  coverCharge: string;
  awardOrBadge?: string;
  region: SingaporeRegion;
  area: string;
  address: string;
  nearestMrt: string;
  shelteredMrtAccess: boolean;
  shelterLevel: NightspotShelter;
  hazeSafetyNote: string;
  musicGenre: string;
  signatureCocktails: SignatureCocktailOrPerk[];
  dressCode: DressCode;
  openingHours: string;
  reservationAdvice: string;
  touristTip: string;
  indoorEnvironmentNote?: string;
  googleMapsQuery: string;
  description: string;
}
