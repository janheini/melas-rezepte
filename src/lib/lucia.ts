import { Lucia } from "lucia";
import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite";
import { createClient } from "@libsql/client";

export const db = createClient({
    url: import.meta.env.TURSO_URL,
    authToken: import.meta.env.TURSO_TOKEN,
});

const adapter = new LibSQLAdapter(db, {
    user: "user",
    session: "session",
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: import.meta.env.PROD,
        },
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DatabaseUser, "id">;
    }
}

export interface DatabaseUser {
    id: string;
    username: string;
    password: string;
}

// if (import.meta.env.DEV) {
//     console.log(
//         `Running in DEV mode using sqlite db ${import.meta.env.TURSO_URL_DEV}`,
//     );
// }
//
// const db = import.meta.env.PROD
//     ? createClient({
//           url: import.meta.env.TURSO_URL,
//           authToken: import.meta.env.TURSO_TOKEN,
//       })
//     : createClient({
//           url: import.meta.env.TURSO_URL_DEV,
//       });
//
// export const auth = lucia({
//     env: import.meta.env.DEV ? "DEV" : "PROD",
//     middleware: astro(),
//     adapter: libsql(db, {
//         user: "user",
//         key: "user_key",
//         session: "session",
//     }),
//     getUserAttributes: (data) => {
//         return {
//             username: data.username,
//         };
//     },
// });
//
// export type Auth = typeof auth;
