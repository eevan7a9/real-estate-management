import { HttpHeaders } from '@angular/common/http';

export interface ApiResponse {
  status: number | string;
  message: string;

  headers?: HttpHeaders;
  name?: string;
  data?: any;
  ok?: boolean;
  statusText?: string;
  error?: { status: number; message: string };
  url?: string;
}

