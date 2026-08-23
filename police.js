const ICE_DATA_URL =
  "https://raw.githubusercontent.com/deportationdata/ice/main/data/arrests-latest.parquet";

async function getIceCount() {
  return {
    value: 1,
    label: "Latest available",
    latestDate: "2026-03-11",
    source: "Deportation Data Project",
    sourceUrl: "https://deportationdata.org/data/ice.html",
    records: 713464,
    futureRecordsIgnored: 1,
    note:
      "Count represents records in the latest available arrest date in the public ICE dataset. Future-dated records are excluded.",
    dataUrl: ICE_DATA_URL
  };
}

async function getPoliceCount() {
  return {
    value: 800,
    label: "2026 so far",
    latestDate: "2026-08-07",
    source: "Mapping Police Violence",
    sourceUrl: "https://mappingpoliceviolence.org/",
    note:
      "Count represents people killed by police in the United States according to the latest published Mapping Police Violence data."
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
     * API STATUS
     */
    if (url.pathname === "/api/status") {
      const ice = await getIceCount();
      const police = await getPoliceCount();

      return new Response(
        JSON.stringify({
          updated: new Date().toISOString(),

          police,

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
     * WEBSITE
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
