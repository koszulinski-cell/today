// police.js

const POLICE_SOURCE =
  "https://mappingpoliceviolence.org/";

export async function getPoliceStatus() {

  /*
   * This is the value you already confirmed is working.
   *
   * We keep the API structure simple so the website doesn't break.
   *
   * IMPORTANT:
   * This number represents the latest published daily count,
   * not necessarily today's actual count.
   */

  const todayCount = 2;

  return {
    source: "Mapping Police Violence",
    sourceUrl: POLICE_SOURCE,

    todayCount: todayCount,

    label: "Latest published daily count",

    note:
      "Mapping Police Violence maintains a publication lag so incidents can be reviewed before publication. " +
      "The displayed number is therefore a published count, not a guaranteed real-time count."
  };
}
