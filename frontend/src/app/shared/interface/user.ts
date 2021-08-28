export interface User {
  id?: string;
  email: string;
  fullName: string;
  created?: Date;
  password?: string;
  enquiries?: string[];
  properties?: string[];
  accessToken?: string;
  aboutMe?: string;
  location?: string;
}
