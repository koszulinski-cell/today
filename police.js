const ICE_DATA_URL =
  "https://raw.githubusercontent.com/deportationdata/ice/main/data/arrests-latest.parquet";

async function getIceCount() {
  /*
   * The official Deportation Data Project file is a Parquet file
   * containing one row per ICE arrest.
   *
   * Cloudflare Workers cannot natively read Parquet files, so for now
   * we expose the verified data coverage and keep the actual count
   * explicitly unavailable rather than inventing a number.
   */

  return {
    date: "2026-03-10",
    count: null,
    status: "data_available_count_not_yet_calculated",
    source: "Deportation Data Project",
    sourceUrl: "https://deportationdata.org/data/ice.html",
    dataUrl: ICE_DATA_URL
  };
}


export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    /*
     * /api/status
     */
    if (url.pathname === "/api/status") {

      const ice = await getIceCount();

      return new Response(
        JSON.stringify({
          updated: new Date().toISOString(),

          police: {
            source: "Mapping Police Violence",
            sourceUrl: "https://mappingpoliceviolence.org/",
            latestAvailableDate: "2026-08-07",
            count: null,
            status: "latest_available_day"
          },

          ice
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
     * Website
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
