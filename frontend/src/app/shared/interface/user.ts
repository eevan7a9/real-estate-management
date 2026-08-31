import { Notification } from './notification';
import type { Property } from './property';

export type UserRole = 'owner' | 'agent' | 'broker';

export interface PublicLocation {
  city?: string;
  region?: string;
  country?: string;
}

export interface PublicProfileLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
}

export interface User {
  user_id: string;
  email: string;
  fullName: string;
  about?: string;
  address?: string;
  verified?: boolean;
  profileImage?: string;
  role?: UserRole;
  businessName?: string;
  licenseNumber?: string;
  publicLocation?: PublicLocation;
  links?: PublicProfileLinks;
  phone?: string;
  showPhone?: boolean;
  showEmail?: boolean;
}

export interface UserSignedIn extends User {
  accessToken: string;
}

export interface UserDetails extends User {
  createdAt?: Date;
  updatedAt?: Date;
  properties?: string[];
  notifications?: Notification[];
}

export type PublicProfileProperty = Pick<
  Property,
  | 'property_id'
  | 'name'
  | 'address'
  | 'type'
  | 'transactionType'
  | 'price'
  | 'paymentFrequency'
  | 'images'
  | 'currency'
>;

export interface PublicUserProfile extends Omit<User, 'email' | 'address'> {
  /** Present only when the owner has enabled public email visibility. */
  email?: string;
  activePropertyCount: number;
  properties: PublicProfileProperty[];
}
