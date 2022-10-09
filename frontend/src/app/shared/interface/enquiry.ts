interface EnquiryProperty {
  property_id: string;
  name: string;
}

export interface Enquiry {
  enquiry_id: string;
  content: string;
  email: string;
  title: string;
  topic: string;
  read: boolean;
  property: EnquiryProperty;
  replyTo?: {
    enquiry_id: string;
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

export interface EnquiryCreate {
  content: string;
  email: string;
  title: string;
  topic: string;
  property: EnquiryProperty;
  replyTo?: {
    id: string;
    title: string;
    topic: string;
  };
  userTo: string;
}
