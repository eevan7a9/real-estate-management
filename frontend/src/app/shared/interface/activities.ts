export interface Activity {
  id: string;
  action: string;
  description: string;
  user_id: string;
  property_id?: string,
  enquiry_id?: string,
  createdAt: string;
}
