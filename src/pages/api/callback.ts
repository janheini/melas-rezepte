import { AuthorizationCode } from "simple-oauth2";
import { config } from "../../lib/config";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
    const host = request.headers.get('host');
    const url = new URL(`https://${host}/${request.url}`);
    const urlParams = url.searchParams;
    const code = urlParams.get("code");
    const provider = urlParams.get("provider");

    // we recreate the client we used to make the request
    const client = new AuthorizationCode(config(provider));

    // create our token object
    const tokenParams = {
        code,
        redirect_uri: `https://${host}/api/callback?provider=${provider}`
    };

    try {
        // try to create an access token from the client
        const accessToken = await client.getToken(tokenParams);
        const token = accessToken.token["access_token"];

        const responseBody = renderBody("success", {
            token,
            provider
        });

        return new Response(typeof(responseBody));
    } catch (e) {
        return new Response(e);
    }
};

// This renders a simple page with javascript that allows the pop-up page
// to communicate with its opener 
function renderBody(status, content) {
    return `
<html>
<head>
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:${content.provider}:${status}:${JSON.stringify(
        content
    )}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:${content.provider}", "*");
    </script>
</head>
<body> </body>
</html>
  `;
}
