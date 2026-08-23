export async function getPoliceData() {
  const sourceUrl = "https://mappingpoliceviolence.org/";

  try {
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      throw new Error(`MPV returned HTTP ${response.status}`);
    }

    const html = await response.text();

    /*
     * MPV publishes daily entries in the page like:
     *
     * Police killed 1 people on August 07, 2026
     *
     * We extract those entries from the public page.
     */

    const pattern =
      /Police killed\s+(\d+)\s+people on ([A-Za-z]+ \d{2}, \d{4})/g;

    const records = [];

    let match;

    while ((match = pattern.exec(html)) !== null) {
      records.push({
        count: Number(match[1]),
        date: match[2]
      });
    }

    if (records.length === 0) {
      return {
        source: "Mapping Police Violence",
        sourceUrl,
        todayCount: null,
        status: "no_daily_data_found",
        note: "The MPV page format may have changed."
      };
    }

    /*
     * The last daily record on the page is the newest
     * published daily count.
     */

    const latest = records[records.length - 1];

    return {
      source: "Mapping Police Violence",
      sourceUrl,

      todayCount: latest.count,

      latestPublishedDate: latest.date,

      status: "latest_published_count",

      note:
        "This is the latest published daily count from Mapping Police Violence. It is not necessarily today's real-world count because MPV intentionally maintains a publication lag."
    };

  } catch (error) {

    return {
      source: "Mapping Police Violence",
      sourceUrl,

      todayCount: null,

      status: "source_error",

      error: error.message
    };
  }
}
