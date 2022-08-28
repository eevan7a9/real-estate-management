export interface Enquiry {
  enquiry_id: string;
  content: string;
  email: string;
  title: string;
  topic: string;
  read: boolean;
  property: {
    property_id: string;
    name: string;
  };
  user?: {
    from: string;
    to: string;
  };
  replyTo: {
    id: string;
    title: string;
    topic: string;
  };
  users: {
    from: {
      user_id: string;
      keep: boolean;
    };
    to: {
      user_id: string;
      keep: boolean;
    };
  };
  createdAt?: string;
  updatedAt?: string;

}
