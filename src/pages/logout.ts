import type { APIContext } from "astro";
import { deleteSession } from "@lib/session";

export async function POST(context: APIContext): Promise<Response> {
    if (!context.locals.session) {
        return new Response(null, {
            status: 401,
        });
    }

    await deleteSession(context.locals.session.id);
    context.cookies.delete("session");

    // will redirect to '/' ?
    return new Response();
}
