import { Query } from "encore.dev/api";

export interface iGetTokensRequest {
    userId: Query<string>;
}

export interface iCreateTokenRequest {
    userId: string;
    scopes: string[];
    expiresInMinutes: number;
}

export interface iGetTokensResponse {
    id: string;
    userId: string;
    scopes: string[];
    createdAt: Date;
    expiresAt: Date;
    token: string;
}