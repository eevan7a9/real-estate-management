import { HttpContextToken } from '@angular/common/http';

/** Prevents the auth interceptor from refreshing a refresh/logout request. */
export const SKIP_AUTH_REFRESH = new HttpContextToken<boolean>(() => false);

/** Ensures a request is retried at most once after a successful refresh. */
export const AUTH_REFRESH_RETRIED = new HttpContextToken<boolean>(() => false);
