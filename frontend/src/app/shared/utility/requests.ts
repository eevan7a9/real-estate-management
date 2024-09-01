import { HttpHeaders } from '@angular/common/http';

interface HeaderDict {
  token: string;
  contentType?: string;
}

export const headerDict = (
  arg: HeaderDict = { token: '', contentType: 'application/json' }
) => ({
  ...(arg.contentType && { 'Content-Type': arg.contentType }),
  Accept: 'application/json',
  Authorization: `Bearer ${arg.token}`,
  'Access-Control-Allow-Headers': 'Content-Type',
});

export const requestOptions = (
  { token = '', contentType = 'application/json' },
  body = {}
) => ({
  headers: new HttpHeaders(headerDict({ token, contentType })),
  body,
});
