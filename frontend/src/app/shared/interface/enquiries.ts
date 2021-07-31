export interface Enquiry {
  id: string;
  content: string;
  date: Date;
  email: string;
  title: string;
  topic: string;
  read: boolean;
  property: {
    name: string;
    id: string;
  };
  user: {
    from: string;
    to: string;
  };

}
