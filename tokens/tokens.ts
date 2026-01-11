import { api, APIError, ErrCode } from "encore.dev/api";
import { db } from "./database";
import { iCreateTokenRequest, iGetTokensRequest, iGetTokensResponse } from "./interfaces";
import { validateCreateToken, validateUserId } from "./validation";


export const createToken = api({ expose: true, method: 'POST', path: '/api/tokens' },
    async (req: iCreateTokenRequest): Promise<iGetTokensResponse> => {
        try {
            validateCreateToken(req);

            const { userId, scopes, expiresInMinutes } = req;
            const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
            const tokenValue = crypto.randomUUID();

            const query = "INSERT INTO tokens (token, user_id, scopes, expires_at) VALUES ($1, $2, $3::jsonb, $4) RETURNING id, token, user_id, scopes, created_at, expires_at;"

            const token = await db.rawQueryRow(query, tokenValue, userId, scopes, expiresAt);

            if (!token) {
                throw new APIError(ErrCode.Internal, "Failed to insert token");
            }

            return {
                id: token.id,
                userId: token.user_id,
                scopes: token.scopes,
                createdAt: token.created_at,
                expiresAt: token.expires_at,
                token: token.token
            }
        } catch (error) {

            if (error instanceof APIError) throw error;

            if (error && typeof error === 'object' && 'code' in error) {
                const dbError = error as { code: string; message: string };

                // Duplicate token error
                if (dbError.code === '23505') {
                    throw APIError.alreadyExists("Token already exists");
                }
            }

            // Generic internal error
            throw APIError.internal("Failed to create token", error as Error);
        }
    });


export const getTokens = api({ expose: true, method: 'GET', path: '/api/tokens' },
    async (req: iGetTokensRequest): Promise<{ tokens: iGetTokensResponse[] }> => {
        validateUserId(req);

        const { userId } = req;
        if (!userId || userId.trim() === "") {
            throw new Error("userId is required");
        }

        const tokens = await db.queryAll`SELECT * FROM tokens WHERE user_id = ${userId}
                                         AND expires_at > NOW()
                                         ORDER BY created_at DESC`;

        return {
            tokens: tokens.map((token) => ({
                "id": token.id,
                "userId": token.user_id,
                "scopes": token.scopes,
                "createdAt": token.created_at.toISOString(),
                "expiresAt": token.expires_at.toISOString(),
                "token": token.token
            }))
        };
    });
