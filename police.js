export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * API STATUS
     */
    if (url.pathname === "/api/status") {
      return new Response(
        JSON.stringify({
          updated: new Date().toISOString(),

          police: {
            source: "Mapping Police Violence",
            sourceUrl: "https://mappingpoliceviolence.org/",
            dataLastUpdated: "2026-08-05",
            latestAvailableDate: "2026-08-07",
            latestAvailableCount: 1,
            status: "latest_available_day"
          },

          ice: {
            source: "Deportation Data Project",
            sourceUrl: "https://deportationdata.org/data/ice.html",
            dataThrough: "2026-03-10",
            status: "latest_available_day",
            note:
              "The ICE arrests dataset currently runs through March 10, 2026. The site should calculate the daily count from the underlying dataset rather than invent a real-time number."
          }
        }),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8",
            "cache-control": "no-store",
            "access-control-allow-origin": "*"
          }
        }
      );
    }

    /*
     * HEALTH CHECK
     */
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          ok: true,
          service: "today",
          time: new Date().toISOString()
        }),
        {
          headers: {
            "content-type": "application/json; charset=UTF-8",
            "cache-control": "no-store",
            "access-control-allow-origin": "*"
          }
        }
      );
    }

    /*
     * Serve the website.
     */
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Today is running.", {
      headers: {
        "content-type": "text/plain; charset=UTF-8"
      }
    });
  }
};
