import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface UserSession {
    email?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType?: string;
    expiresIn?: number;
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
            tap(res => this.handleAuthSuccess(res, credentials.email))
        );
    }

    register(data: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap(res => this.handleAuthSuccess(res, data.email))
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
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }

    private handleAuthSuccess(res: AuthResponse, email?: string) {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        this.currentUser.set({ email });
    }

    private loadUserFromStorage() {
        const token = localStorage.getItem('accessToken');
        if (token) {
            this.currentUser.set({});
        }
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}
