import { defineMiddleware } from "astro:middleware";
import { validateSessionToken } from "@lib/session.ts";

export const onRequest = defineMiddleware(async (context, next) => {
    // Retrieve the session token
    const token = context.cookies.get("session")?.value ?? null;
    if (!token) {
        context.locals.session = null;
        return next();
    }

    // Validate the session token
    context.locals.session = await validateSessionToken(token);
    return next();
});
