import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { createClient } from "@libsql/client";

if (import.meta.env.DEV) {
    console.log(`Running in DEV mode using sqlite db ${import.meta.env.TURSO_URL_DEV}`);
}

const db = import.meta.env.PROD ?
    createClient({
        url: import.meta.env.TURSO_URL,
        authToken: import.meta.env.TURSO_TOKEN
    })
    : createClient({
        url: import.meta.env.TURSO_URL_DEV,
    });


export const auth = lucia({
    env: import.meta.env.DEV ? "DEV" : "PROD",
    middleware: astro(),
    adapter: libsql(db, {
        user: "user",
        key: "user_key",
        session: "user_session"
    }),
    getUserAttributes: (data) => {
        return {
            username: data.username
        };
    }
});

export type Auth = typeof auth;
