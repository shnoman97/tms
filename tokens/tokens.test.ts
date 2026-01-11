import { describe, test, expect, beforeEach } from "vitest";
import { createToken, getTokens } from "./tokens";

describe("Token Service", () => {
  describe("createToken", () => {
    test("should create a valid token", async () => {
      const request = {
        userId: "user123",
        scopes: ["read", "write"],
        expiresInMinutes: 60,
      };

      const response = await createToken(request);

      expect(response.userId).toBe("user123");
      expect(response.scopes).toEqual(["read", "write"]);
      expect(response.token).toBeTruthy();
      expect(response.id).toBeTruthy();
      
      const now = new Date();
      const expectedExpiry = new Date(now.getTime() + 60 * 60 * 1000);
      const timeDiff = Math.abs(response.expiresAt.getTime() - expectedExpiry.getTime());
      expect(timeDiff).toBeLessThan(2000);
    });

    test("should reject empty userId", async () => {
      const request = {
        userId: "",
        scopes: ["read"],
        expiresInMinutes: 60,
      };

      await expect(createToken(request)).rejects.toThrow();
    });

    test("should reject empty scopes array", async () => {
      const request = {
        userId: "user123",
        scopes: [],
        expiresInMinutes: 60,
      };

      await expect(createToken(request)).rejects.toThrow();
    });

    test("should reject negative expiresInMinutes", async () => {
      const request = {
        userId: "user123",
        scopes: ["read"],
        expiresInMinutes: -10,
      };

      await expect(createToken(request)).rejects.toThrow();
    });

    test("should reject zero expiresInMinutes", async () => {
      const request = {
        userId: "user123",
        scopes: ["read"],
        expiresInMinutes: 0,
      };

      await expect(createToken(request)).rejects.toThrow();
    });

    test("should accept multiple scopes", async () => {
      const request = {
        userId: "user456",
        scopes: ["read", "write", "delete", "admin"],
        expiresInMinutes: 120,
      };

      const response = await createToken(request);
      expect(response.scopes).toEqual(["read", "write", "delete", "admin"]);
    });
  });

  describe("getTokens", () => {
    beforeEach(async () => {
      await createToken({
        userId: "testuser",
        scopes: ["read"],
        expiresInMinutes: 60,
      });
    });

    test("should return active tokens for user", async () => {
      const response = await getTokens({ userId: "testuser" });

      expect(response.length).toBeGreaterThan(0);
      expect(response[0].userId).toBe("testuser");
    });

    test("should return empty array for user with no tokens", async () => {
      const response = await getTokens({ userId: "nonexistent" });
      expect(response).toEqual([]);
    });

    test("should reject empty userId", async () => {
      await expect(getTokens({ userId: "" })).rejects.toThrow();
    });

    test("should only return non-expired tokens", async () => {
      const userId = "expiry-test-user";
      await createToken({
        userId,
        scopes: ["read"],
        expiresInMinutes: 60,
      });

      const response = await getTokens({ userId });
      
      response.forEach(token => {
        expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
      });
    });
  });
});