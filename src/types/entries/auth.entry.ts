import type { Member } from './member.entry.ts';
import type { User } from './user.entry.ts';
import type { Role } from './role.entry.ts';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponseData {
    access_token: string;
    identity_type: "member";
    member: Member;
}

export interface LoginResponse {
    success: boolean;
    status: number;
    message: string;
    data: LoginResponseData;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    roles: string[];
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: User;
        roles: Role[];
    };
}
