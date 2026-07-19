import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

interface HeaderDict {
  token: string;
  contentType?: string;
}

export const headerDict = (
  arg: HeaderDict = { token: '', contentType: 'application/json' },
) => ({
  ...(arg.contentType && { 'Content-Type': arg.contentType }),
  Accept: 'application/json',
  Authorization: `Bearer ${arg.token}`,
  'Access-Control-Allow-Headers': 'Content-Type',
});

export const requestOptions = (
  { token = '', contentType = 'application/json' },
  body = {},
) => ({
  headers: new HttpHeaders(
    headerDict({
      token,
      ...(contentType ? { contentType } : {}),
    }),
  ),
  body,
});

export const errorHandler = (err: HttpErrorResponse): {
  status: number;
  message: string;
  error: { status: number; message: string };
} => {
  const { message, error, status } = err;
  return {
    status: err.status || status || 500,
    message: error?.message || message || 'An unknown error occurred.',
    error: error.error || error
  };
};
