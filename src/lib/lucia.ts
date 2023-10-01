import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { createClient } from "@libsql/client";

const db = createClient({
    url: "file:melas-rezepte.sqlite3"
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
