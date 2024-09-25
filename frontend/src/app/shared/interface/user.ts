import { Activity } from "./activities";

export interface User {
  user_id: string;
  email: string;
  fullName: string;
  about?: string;
  address?: string;
}

export interface UserSignedIn extends User {
  accessToken: string;
}

export interface UserDetails extends User {
  createdAt?: Date;
  updatedAt?: Date;
  properties?: string[];
  activities?: Activity[];
  notifications?: Notification[];
}
