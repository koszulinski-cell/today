export async function getPoliceData() {
  /*
    This is the police-data module.

    For the moment, we are returning the current source status.
    The next version will connect this to the actual downloadable
    Mapping Police Violence dataset.
  */

  return {
    source: "Mapping Police Violence",
    sourceUrl: "https://mappingpoliceviolence.org/",
    sourceLastUpdated: "2026-08-07",

    /*
      IMPORTANT:
      We are deliberately not putting a number here yet.
      The source's current public tracker is not updated through
      August 23, so we cannot honestly call a number "today's count".
    */
    todayCount: null,

    status: "source_not_current_through_today"
  };
}
