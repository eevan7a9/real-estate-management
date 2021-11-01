import { Coord } from './map';

export interface Property {
  property_id: string;
  name: string;
  address: string;
  description?: string;
  type: string;
  position: Coord;
  price: number;
  enquiries?: string[];
  features?: string[];
  profileImage?: string;
  images?: string[];
  currency?: string;
  contactNumber?: string;
  contactEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: string;
}
