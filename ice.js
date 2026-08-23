// ice.js
//
// ICE arrest data source:
// Deportation Data Project
//
// IMPORTANT:
// This is NOT a real-time ICE arrest feed.
// The source dataset is updated periodically and may lag behind
// the current date.

const ICE_DATA_URL =
  "https://github.com/deportationdata/ice/raw/refs/heads/main/data/arrests-latest.parquet";

const ICE_SOURCE_URL =
  "https://deportationdata.org/data/processed/ice.html";

export async function getIceStatus() {
  return {
    source: "Deportation Data Project",
    sourceUrl: ICE_SOURCE_URL,
    status: "latest_available",
    value: null,
    label: "Latest available",
    note:
      "ICE does not publish a public nationwide real-time arrest feed. " +
      "The Deportation Data Project provides periodically updated individual-level data."
  };
}
