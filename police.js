export async function getPoliceData() {
  const sourceUrl = "https://mappingpoliceviolence.org/";

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "TODAY-data-tracker/1.0"
      }
    });

    if (!response.ok) {
      throw new Error(`MPV returned HTTP ${response.status}`);
    }

    const html = await response.text();

    /*
     * Find every daily entry published by MPV.
     *
     * Example:
     * Police killed 5 people on January 01, 2026
     */

    const pattern =
      /Police killed\s+(\d+)\s+people on\s+([A-Za-z]+)\s+(\d{2}),\s+(\d{4})/gi;

    const records = [];

    let match;

    while ((match = pattern.exec(html)) !== null) {
      records.push({
        count: Number(match[1]),
        date: `${match[2]} ${match[3]}, ${match[4]}`
      });
    }

    if (records.length === 0) {
      return {
        source: "Mapping Police Violence",
        sourceUrl,
        todayCount: null,
        status: "no_daily_data_found",
        recordsFound: 0,
        note: "MPV's page format could not be read."
      };
    }

    const latest = records[records.length - 1];

    return {
      source: "Mapping Police Violence",
      sourceUrl,

      todayCount: latest.count,

      latestPublishedDate: latest.date,

      status: "latest_published_count",

      recordsFound: records.length,

      note:
        "This is the latest daily count published by Mapping Police Violence. It is not necessarily the count for today's calendar date."
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
