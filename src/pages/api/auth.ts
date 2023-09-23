import { IncomingMessage, ServerResponse } from "http";
import { AuthorizationCode } from "simple-oauth2";
import { randomBytes } from "crypto";
import { config, Provider } from "../../lib/config";
import { scopes } from "../../lib/scopes";

export const randomString = () => randomBytes(4).toString("hex");

export async function GET({req}) {
  const { host } = req.headers;
  const url = new URL(`https://${host}/${req.url}`);
  const urlParams = url.searchParams;
  const provider = urlParams.get("provider") as Provider;

  const client = new AuthorizationCode(config(provider));

  const authorizationUri = client.authorizeURL({
    redirect_uri: `https://${host}/callback?provider=${provider}`,
    scope: scopes[provider],
    state: randomString(),
  });

  return redirect(authorizationUri, 301);
};
