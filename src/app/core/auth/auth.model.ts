export interface LoginRequest {
    email : string;
    password : string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: number;
}