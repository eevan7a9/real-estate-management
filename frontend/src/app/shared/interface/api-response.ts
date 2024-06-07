import { HttpHeaders } from '@angular/common/http';

export interface ApiResponse<T = undefined> {
  status: number | string;
  message: string;

  headers?: HttpHeaders;
  name?: string;
  data?: T;
  ok?: boolean;
  statusText?: string;
  error?: { status: number; message: string };
  url?: string;
}

