import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface UserSession {
    email?: string;
    fullName?: string;
    userId?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
    expiresIn?: number;
}

interface JwtPayload {
    sub: string;
    userId: string;
    fullName: string;
    auth: string;
    iat: number;
    exp: number;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = `${environment.apiUrl}/auth`;

    // Signals for modern state management
    currentUser = signal<UserSession | null>(null);
    isAuthenticated = computed(() => !!this.getAccessToken());

    constructor() {
        this.loadUserFromStorage();
    }

    login(credentials: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.handleAuthSuccess(res))
        );
    }

    register(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(res => this.handleAuthSuccess(res))
        );
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return throwError(() => new Error('No refresh token'));

        return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
            tap(res => this.handleAuthSuccess(res)),
            catchError(err => {
                this.logout();
                return throwError(() => err);
            })
        );
    }

    logout() {
        this.currentUser.set(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.router.navigate(['/auth/login']);
    }

    private handleAuthSuccess(res: AuthResponse) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.loadUserFromToken(res.accessToken);
    }

    private loadUserFromStorage() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.loadUserFromToken(token);
        }
    }

    private loadUserFromToken(token: string) {
        const payload = this.decodeToken(token);
        if (payload) {
            this.currentUser.set({
                email: payload.sub,
                fullName: payload.fullName,
                userId: payload.userId
            });
        }
    }

    private decodeToken(token: string): JwtPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}
