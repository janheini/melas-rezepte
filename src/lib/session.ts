import { createClient } from "@libsql/client";
import type { APIContext } from "astro";

const inactivityTimeoutSeconds = 60 * 60 * 24 * 10; // 10 days
const activityCheckIntervalSeconds = 60 * 60; // 1 hour

export const db = createClient({
    // url: "file:melas-rezepte.sqlite",
    url: import.meta.env.TURSO_URL,
    authToken: import.meta.env.TURSO_TOKEN,
});

export function setSessionCookie(
    cookies: APIContext["cookies"],
    token: string,
) {
    cookies.set("session", token, {
        httpOnly: true,
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: inactivityTimeoutSeconds,
    });
}

function generateSecureRandomString(): string {
    // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

    // Generate 24 bytes = 192 bits of entropy.
    // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {
        // >> 3 "removes" the right-most 3 bits of the byte
        id += alphabet[bytes[i] >> 3];
    }
    return id;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
        c |= a[i] ^ b[i];
    }
    return c === 0;
}

async function hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
}

export async function createSession(
    username: string,
): Promise<SessionWithToken> {
    const now = new Date();

    const id = generateSecureRandomString();
    const secret = generateSecureRandomString();
    const secretHash = await hashSecret(secret);

    const token = id + "." + secret;

    const session: SessionWithToken = {
        id,
        username,
        secretHash,
        createdAt: now,
        lastVerifiedAt: now,
        token,
    };

    await db.execute(
        "INSERT INTO session (id, username, secret_hash, last_verified_at, created_at) VALUES (?, ?, ?, ?, ?)",
        [
            session.id,
            session.username,
            session.secretHash,
            Math.floor(session.lastVerifiedAt.getTime() / 1000),
            Math.floor(session.createdAt.getTime() / 1000),
        ],
    );

    return session;
}

export async function validateSessionToken(
    token: string,
): Promise<Session | null> {
    const now = new Date();

    const tokenParts = token.split(".");
    if (tokenParts.length !== 2) {
        return null;
    }
    const sessionId = tokenParts[0];
    const sessionSecret = tokenParts[1];

    const session = await getSession(sessionId);
    if (!session) {
        return null;
    }

    const tokenSecretHash = await hashSecret(sessionSecret);
    const validSecret = constantTimeEqual(
        tokenSecretHash,
        new Uint8Array(session.secretHash),
    );
    if (!validSecret) {
        return null;
    }

    if (
        now.getTime() - session.lastVerifiedAt.getTime() >=
        activityCheckIntervalSeconds * 1000
    ) {
        session.lastVerifiedAt = now;
        await db.execute(
            "UPDATE session SET last_verified_at = ? WHERE id = ?",
            [Math.floor(session.lastVerifiedAt.getTime() / 1000), sessionId],
        );
    }

    return session;
}

async function getSession(sessionId: string): Promise<Session | null> {
    const now = new Date();

    const result = await db.execute(
        "SELECT id, username, secret_hash, last_verified_at, created_at FROM session WHERE id = ?",
        [sessionId],
    );
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    const session: Session = {
        id: row[0] as string,
        username: row[1] as string,
        secretHash: row[2],
        lastVerifiedAt: new Date((row[3] as number) * 1000),
        createdAt: new Date((row[4] as number) * 1000),
    };

    // Inactivity timeout
    if (
        now.getTime() - session.lastVerifiedAt.getTime() >=
        inactivityTimeoutSeconds * 1000
    ) {
        await deleteSession(sessionId);
        return null;
    }

    return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
    await db.execute("DELETE FROM session WHERE id = ?", [sessionId]);
}

interface SessionWithToken extends Session {
    token: string;
}

export interface Session {
    id: string;
    username: string;
    secretHash: Uint8Array; // Uint8Array is a byte array
    lastVerifiedAt: Date;
    createdAt: Date;
}
