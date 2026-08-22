import {
  PaymentFrequency,
  PropertyType,
  TransactionType,
} from '../enums/property';
import { Coord } from './map';

export interface Property {
  _id: string;
  property_id: string;
  name: string;
  address: string;
  description?: string;
  type: PropertyType;
  transactionType: TransactionType;
  position: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  price: number;
  paymentFrequency?: PaymentFrequency;
  enquiries?: string[];
  features?: string[];
  images?: string[];
  currency?: string;
  contactNumber?: string;
  contactEmail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  user_id: string;
}

export interface PropertyCreateForm extends Omit<
  Property,
  '_id' | 'property_id' | 'createdAt' | 'updatedAt'
> { }
export interface PropertyEditForm extends Omit<
  Property,
  '_id' | 'createdAt' | 'updatedAt'
> { }

export interface PropertyMap extends Pick<
  Property,
  'property_id' | 'type' | 'position'
> { }
export interface PropertyPage {
  items: Property[];
  lastCreatedAt?: string;
  lastPrice?: string;
  lastName?: string;
  last_id?: string;
  hasMore?: boolean;
}

export interface PropertyMapPopup extends Pick<
  Property,
  "property_id" |
  "name" |
  "address" |
  "description" |
  "type" |
  "transactionType" |
  "price" |
  "images" |
  "currency" |
  "user_id"
> { }
