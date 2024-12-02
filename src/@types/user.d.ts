export interface LoginRequest {
    login: string;
    password: string;
}


export interface LoginResponse {
    login: string;
    token: string;
}