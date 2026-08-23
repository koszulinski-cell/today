// ice.js
//
// ICE arrest data from the Deportation Data Project.
//
// IMPORTANT:
// The Deportation Data Project does NOT provide a real-time ICE
// nationwide arrest feed.
//
// Current public release covers ICE enforcement through early
// March 2026.
//
// We therefore display the latest available dataset date rather
// than pretending it represents today's arrests.

const ICE_SOURCE =
  "https://deportationdata.org/data/ice.html";

export async function getIceStatus() {

  return {

    source: "Deportation Data Project",

    sourceUrl: ICE_SOURCE,

    value: null,

    label: "Latest available",

    dataThrough: "March 10, 2026",

    status: "latest_available",

    note:
      "The Deportation Data Project's latest public ICE arrest dataset covers enforcement through March 10, 2026. " +
      "ICE does not publish a public nationwide real-time arrest feed, so a verified August 2026 nationwide daily count is not available from this source."
  };
}
