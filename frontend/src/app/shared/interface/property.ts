import { Coord } from './map';

export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  type: string;
  position: Coord;
  date: Date;
  price: number;
  enquiries?: string[];
  features?: string[];
  currency?: string;
  contactNumber?: string;
  contactEmail?: string;
  userId: string;
}
