import pandas as pd
import json
from datetime import datetime, timezone

# ============================================================
# ICE ARREST DATA CALCULATOR
# ============================================================

INPUT_FILE = "arrests-latest.xlsx"
OUTPUT_FILE = "ice-data.json"

# Today's date according to UTC
today = datetime.now(timezone.utc).date()

print("Loading ICE data...")
df = pd.read_excel(INPUT_FILE)

print(f"Number of records: {len(df):,}")

# Make sure the arrest date is actually a date
df["apprehension_date"] = pd.to_datetime(
    df["apprehension_date"],
    errors="coerce"
)

# Remove rows that have no usable date
df = df.dropna(subset=["apprehension_date"]).copy()

# Convert to plain dates
df["arrest_date"] = df["apprehension_date"].dt.date

print(f"Dataset earliest date: {df['arrest_date'].min()}")
print(f"Dataset latest raw date: {df['arrest_date'].max()}")
print(f"Today: {today}")

# ============================================================
# IMPORTANT:
# Ignore dates that are later than today.
#
# This prevents an erroneous/future record from becoming
# the "latest" arrest date shown on the website.
# ============================================================

valid = df[df["arrest_date"] <= today].copy()

if valid.empty:
    raise RuntimeError("No ICE arrest records exist on or before today.")

# Find the latest legitimate date
latest_date = valid["arrest_date"].max()

# Count arrests on that date
latest_count = int(
    (valid["arrest_date"] == latest_date).sum()
)

# ============================================================
# Also calculate the number of future-dated records we ignored
# ============================================================

future_records = int((df["arrest_date"] > today).sum())

# ============================================================
# Create output
# ============================================================

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
            "arrest-date in the public ICE dataset. "
            "Future-dated records are excluded."
        )
    }
}

# Save JSON
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2)

# ============================================================
# Print result so we can verify it
# ============================================================

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
