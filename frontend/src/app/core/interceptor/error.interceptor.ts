import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService); // Need to create AuthService first ideally

    return next(req).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(req, next, authService);
            }
            return throwError(() => error);
        })
    );
};

function handle401Error(req: any, next: any, authService: any) {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
            switchMap((token: any) => {
                isRefreshing = false;
                refreshTokenSubject.next(token.accessToken);
                return next(req); // Retry logic should grab new token via AuthInterceptor ideally or manually attach here
                // If AuthInterceptor reads from localStorage, we just need to ensure refreshToken() updates localStorage.
            }),
            catchError((err: any) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => err);
            })
        );
    } else {
        return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(jwt => {
                return next(req);
            })
        );
    }
}
