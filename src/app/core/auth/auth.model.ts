export interface LoginRequest {
    email : string;
    password : string;
}

export interface User {
    id : number;
    name : string;
    email : string;
    role : string;
}

export interface LoginResponse {
    accessToken : string;
    refreshToken : string;
    expiresIn : number;
    user : User;
}