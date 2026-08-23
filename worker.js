import { getPoliceStatus } from "./police.js";
import { getIceStatus } from "./ice.js";

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    /*
     * API
     */

    if (url.pathname === "/api/status") {

      const [police, ice] =
        await Promise.all([
          getPoliceStatus(),
          getIceStatus()
        ]);

      const result = {

        updated: new Date().toISOString(),

        police,

        ice
      };

      return new Response(
        JSON.stringify(result, null, 2),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    /*
     * Everything else:
     * serve the website from Cloudflare.
     */

    return env.ASSETS.fetch(request);
  }
};
