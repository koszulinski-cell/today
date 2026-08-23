export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
      Temporary API.

      This gives our website a predictable place to ask:
      "What are the current numbers?"

      We are deliberately NOT inventing a live number.
      The dates below describe the underlying source data.
    */

    if (url.pathname === "/api/status") {
      const response = {
        updated: "2026-08-23",

        police: {
          value: null,
          label: "Latest available",
          source: "Mapping Police Violence",
          sourceUrl: "https://mappingpoliceviolence.org/",
          note:
            "The public MPV dataset is not currently updated through today, so a verified August 23 count is not available."
        },

        ice: {
          value: null,
          label: "Latest available",
          source: "Deportation Data Project",
          sourceUrl: "https://deportationdata.org/data/ice.html",
          dataThrough: "2026-03-10",
          note:
            "ICE does not publish a public nationwide real-time arrest feed. The latest individual-level dataset currently runs through March 10, 2026."
        }
      };

      return new Response(JSON.stringify(response, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    return new Response("TODAY API is running.", {
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
};
