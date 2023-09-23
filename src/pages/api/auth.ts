import { AuthorizationCode } from "simple-oauth2";
import { randomBytes } from "crypto";
import { config, type Provider } from "../../lib/config";
import { scopes } from "../../lib/scopes";
import type { APIRoute } from "astro";

export const randomString = () => randomBytes(4).toString("hex");

export const GET: APIRoute = async ({ request, redirect }) => {
  const host = request.headers.get('host');
  const url = new URL(`https://${host}/${request.url}`);
  const urlParams = url.searchParams;
  const provider = urlParams.get("provider") as Provider;

  const client = new AuthorizationCode(config(provider));

  const authorizationUri = client.authorizeURL({
    redirect_uri: `https://${host}/api/callback?provider=${provider}`,
    scope: scopes[provider],
    state: randomString(),
  });

  return redirect(authorizationUri, 301);
};
