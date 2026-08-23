import pandas as pd
import json
from datetime import datetime, timezone

INPUT_FILE = "arrests-latest.xlsx"
OUTPUT_FILE = "ice-data.json"

today = datetime.now(timezone.utc).date()

print("Loading ICE data...")

df = pd.read_excel(INPUT_FILE)

print(f"Number of records: {len(df):,}")

df["apprehension_date"] = pd.to_datetime(
    df["apprehension_date"],
    errors="coerce"
)

df = df.dropna(subset=["apprehension_date"]).copy()

df["arrest_date"] = df["apprehension_date"].dt.date

print(f"Dataset earliest date: {df['arrest_date'].min()}")
print(f"Dataset latest raw date: {df['arrest_date'].max()}")
print(f"Today: {today}")

# Ignore records dated in the future.
valid = df[df["arrest_date"] <= today].copy()

if valid.empty:
    raise RuntimeError("No ICE arrest records exist on or before today.")

latest_date = valid["arrest_date"].max()

latest_count = int(
    (valid["arrest_date"] == latest_date).sum()
)

future_records = int(
    (df["arrest_date"] > today).sum()
)

output = {
    "updated": datetime.now(timezone.utc).isoformat(),
    "ice": {
        "value": latest_count,
        "label": "Latest available",
        "latestDate": latest_date.isoformat(),
        "source": "Deportation Data Project",
        "sourceUrl": "https://deportationdata.org/data/ice.html",
        "records": len(valid),
        "futureRecordsIgnored": future_records,
        "note": (
            "Count represents records in the latest available "
            "arrest date in the public ICE dataset. "
            "Future-dated records are excluded."
        )
    }
}

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

print()
print("==========================================")
print("ICE CALCULATION COMPLETE")
print("==========================================")
print(f"Latest valid arrest date: {latest_date}")
print(f"ICE arrests on that date: {latest_count}")
print(f"Future records ignored: {future_records}")
print()
print(f"Created: {OUTPUT_FILE}")
print()
print(json.dumps(output, indent=2))
