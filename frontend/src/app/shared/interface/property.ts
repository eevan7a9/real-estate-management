import { Coord } from './map';

export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  type: string;
  position: Coord;
  features?: string[];
  currency?: string;
  price?: number;
  contactNumber?: string;
  contactEmail?: string;
  userId: string;
}
