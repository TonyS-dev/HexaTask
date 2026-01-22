import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const token = authService.getAccessToken();

    let authReq = req;
    if (token) {
        authReq = addTokenHeader(req, token);
    }

    return next(authReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401 && !authReq.url.includes('/auth/login')) {
                return handle401Error(authReq, next, authService);
            }
            return throwError(() => error);
        })
    );
};

const addTokenHeader = (request: HttpRequest<unknown>, token: string) => {
    return request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
};

const handle401Error = (request: HttpRequest<unknown>, next: HttpHandlerFn, authService: AuthService) => {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((res) => {
                isRefreshing = false;
                refreshTokenSubject.next(res.accessToken);
                return next(addTokenHeader(request, res.accessToken));
            }),
            catchError((err) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        );
    }

    return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next(addTokenHeader(request, token!)))
    );
};
