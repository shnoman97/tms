import { APIError } from "encore.dev/api";
import { iCreateTokenRequest, iGetTokensRequest } from "./interfaces";

export function validateCreateToken(req: iCreateTokenRequest) {
  const { userId, scopes, expiresInMinutes } = req;

  if (!userId || userId.trim() === "") {
    throw APIError.invalidArgument("userId must be a non empty string");
  }

  if (!Array.isArray(scopes) || scopes.length === 0) {
    throw APIError.invalidArgument("scopes must be a non empty array");
  }

  if (scopes.some((s) => !s || s.trim() === "")) {
    throw APIError.invalidArgument("scopes cannot contain empty strings");
  }

  if (!Number.isInteger(expiresInMinutes) || expiresInMinutes <= 0) {
    throw APIError.invalidArgument("expiresInMinutes must be a positive integer");
  }
}

export function validateUserId(req: iGetTokensRequest) {
  if (!req.userId || req.userId.trim() === "") {
    throw APIError.invalidArgument("userId is required");
  }
}
