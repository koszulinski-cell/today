export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * /api/status
     *
     * Returns the latest police and ICE information.
     */
    if (url.pathname === "/api/status") {
      let ice;

      try {
        /*
         * Read the ice-data.json file from the Worker assets.
         */
        const dataRequest = new Request(
          new URL("/ice-data.json", request.url)
        );

        const dataResponse = await env.ASSETS.fetch(dataRequest);

        if (!dataResponse.ok) {
          throw new Error("ice-data.json could not be loaded");
        }

        const data = await dataResponse.json();

        ice = data.ice || {
          value: null,
          status: "ice_data_missing"
        };

      } catch (error) {
        ice = {
          value: null,
          status: "ice_data_error",
          error: error.message
        };
      }

      return new Response(
        JSON.stringify(
          {
            updated: new Date().toISOString(),

            police: {
              source: "Mapping Police Violence",
              sourceUrl: "https://mappingpoliceviolence.org/",
              latestAvailableDate: "2026-08-07",
              count: null,
              status: "latest_available_day"
            },

            ice
          },
          null,
          2
        ),
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
     * /api/health
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
     * Everything else goes to the website files.
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
