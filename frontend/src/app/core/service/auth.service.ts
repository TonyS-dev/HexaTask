import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:8080/api/auth'; // Should be from environment

    private accessTokenKey = 'access_token';
    private refreshTokenKey = 'refresh_token';

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.setSession(res))
        );
    }

    register(data: any) {
        return this.http.post<any>(`${this.apiUrl}/register`, data).pipe(
            tap(res => this.setSession(res))
        );
    }

    refreshToken() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        return this.http.post<any>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
            tap(res => this.setSession(res))
        );
    }

    logout() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this.router.navigate(['/login']);
    }

    private setSession(authResult: any) {
        localStorage.setItem(this.accessTokenKey, authResult.accessToken);
        localStorage.setItem(this.refreshTokenKey, authResult.refreshToken);
    }
}
