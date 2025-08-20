import { defineMiddleware } from "astro:middleware";
import { validateSessionToken } from "@lib/session.ts";

export const onRequest = defineMiddleware(async (context, next) => {
    // Check origin for anything but GET
    // TODO: I think this is not necessary in Astro 5:
    // https://docs.astro.build/en/guides/upgrade-to/v5/#csrf-protection-is-now-set-by-default
    if (context.request.method !== "GET" && import.meta.env.PROD) {
        const originHeader = context.request.headers.get("Origin");
        if (!originHeader || originHeader !== import.meta.env.SITE) {
            return new Response(null, {
                status: 403,
            });
        }
    }

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
