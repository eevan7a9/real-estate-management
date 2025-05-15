import { Activity } from "./activities";
import { Notification } from "./notification";

export interface User {
  user_id: string;
  email: string;
  fullName: string;
  about?: string;
  address?: string;
  verified?: boolean;
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
