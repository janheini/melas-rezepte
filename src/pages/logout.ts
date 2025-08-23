import type { APIContext } from "astro";
import { deleteSession } from "@lib/session";

export async function GET(context: APIContext): Promise<Response> {
    if (context.locals.session) {
        await deleteSession(context.locals.session.id);
        context.cookies.delete("session");
    }
    return context.redirect("/");
}
