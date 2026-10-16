import { SingaporeRegion } from './haze';

export type CuisineType =
  | 'Singapore Local'
  | 'Italian'
  | 'Japanese'
  | 'Korean'
  | 'Chinese'
  | 'Malay'
  | 'Indian';

export type PriceTier = '$' | '$$' | '$$$' | '$$$$';

export type ShelterLevel =
  | 'HEPA-Filtered Mall'
  | 'Fully Enclosed Air-Conditioned'
  | 'High-Ceiling Sheltered & Ventilated';

export type DietaryTag =
  | 'Halal-Certified'
  | 'Muslim-Friendly'
  | 'Vegetarian-Friendly'
  | 'Vegan-Options'
  | 'Pork-Free';

export interface SignatureDish {
  name: string;
  description: string;
  priceSgd: string;
  isMustTry: boolean;
}

export interface Eatery {
  id: string;
  name: string;
  cuisine: CuisineType;
  subCategory: string;
  rating: number;
  reviewCount: number;
  priceTier: PriceTier;
  priceEstimate: string;
  awardOrBadge?: string;
  region: SingaporeRegion;
  area: string;
  address: string;
  nearestMrt: string;
  shelteredMrtAccess: boolean;
  shelterLevel: ShelterLevel;
  indoorEnvironmentNote: string;
  signatureDishes: SignatureDish[];
  dietaryTags: DietaryTag[];
  atmosphere: string;
  openingHours: string;
  reservationAdvice: string;
  touristTip: string;
  googleMapsQuery: string;
  description: string;
}
