import { ApiResponse } from './api-response';

export type ContactSubmissionTopic =
  'general' | 'property' | 'account' | 'technical' | 'other';

export interface ContactSubmissionCreate {
  name: string;
  email: string;
  topic: ContactSubmissionTopic;
  message: string;
}

export interface ContactSubmissionCreated {
  submission_id: string;
  createdAt: string;
}

export type ContactSubmissionResponse = ApiResponse<ContactSubmissionCreated>;
