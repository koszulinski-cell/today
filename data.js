import { getPoliceData } from "./police.js";

export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    /*
     * API endpoint
     *
     * Visiting:
     *
     * /api/status
     *
     * will return our current data.
     */

    if (url.pathname === "/api/status") {

      const police = await getPoliceData();

      const response = {
        updated: new Date().toISOString(),

        police: police,

        ice: {
          value: null,
          label: "Latest available",
          source: "Deportation Data Project",
          sourceUrl: "https://deportationdata.org/data/ice.html",
          dataThrough: "2026-03-10",
          note:
            "ICE does not publish a public nationwide real-time arrest feed."
        }
      };

      return new Response(
        JSON.stringify(response, null, 2),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    /*
     * Anything that isn't /api/status gets
     * the normal website.
     */

    return env.ASSETS.fetch(request);
  }
};
