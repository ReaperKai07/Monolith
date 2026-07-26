export interface LoginRequest {
    email : string;
    password : string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: number;
}

export interface SignInResponse {
    id: number;
    email: string;
    password: string;
}