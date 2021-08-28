export interface User {
  id: string;
  email: string;
  fullName: string;
  enquiries?: string[];
  properties?: string[];
  accessToken?: string;
}
