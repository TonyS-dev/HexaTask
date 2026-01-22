export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'ROLE_ADMIN' | 'ROLE_MEMBER';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}
