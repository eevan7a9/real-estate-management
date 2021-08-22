export interface Notification {
  id: string;
  title: string;
  type: string;
  date: Date;
  content?: {
    id: string;
  };
}
