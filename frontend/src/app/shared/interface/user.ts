export interface User {
  id: string;
  email: string;
  enquiries?: string[];
  properties?: string[];
  accessToken?: string;
}
