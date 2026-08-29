import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  AUTH_REFRESH_RETRIED,
  SKIP_AUTH_REFRESH
} from './auth-request-context';
import { UserService } from './user.service';

const apiUrl = environment.api.server;

export const authRefreshInterceptor: HttpInterceptorFn = (request, next) => {
  if (
    !request.url.startsWith(apiUrl) ||
    request.context.get(SKIP_AUTH_REFRESH)
  ) {
    return next(request);
  }

  const userService = inject(UserService);
  const withCurrentToken = (source = request) => {
    const token = userService.token;
    return source.clone({
      withCredentials: true,
      setHeaders:
        token && source.headers.has('Authorization')
          ? { Authorization: `Bearer ${token}` }
          : {}
    });
  };

  const credentialedRequest = withCurrentToken();
  const shouldRefresh =
    credentialedRequest.headers.has('Authorization') &&
    !!userService.token &&
    !credentialedRequest.context.get(AUTH_REFRESH_RETRIED);

  return next(credentialedRequest).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        !shouldRefresh
      ) {
        return throwError(() => error);
      }

      if (!environment.production) {
        console.info(
          '[Auth refresh] Received 401; refreshing and retrying:',
          credentialedRequest.url
        );
      }

      return userService.refreshAccessToken().pipe(
        catchError((refreshError: unknown) =>
          from(userService.clearSessionAndRedirect()).pipe(
            switchMap(() => throwError(() => refreshError))
          )
        ),
        switchMap(() =>
          next(
            withCurrentToken(credentialedRequest).clone({
              context: credentialedRequest.context.set(
                AUTH_REFRESH_RETRIED,
                true
              )
            })
          )
        )
      );
    })
  );
};
