import pandas as pd

URL = "https://github.com/deportationdata/ice/raw/refs/heads/main/data/arrests-latest.parquet"

print("Downloading the official ICE arrests dataset...")
df = pd.read_parquet(URL)

print("Rows:", len(df))
print("Columns:")
print(list(df.columns))

date_column = "apprehension_date"

df[date_column] = pd.to_datetime(
    df[date_column],
    errors="coerce"
)

latest_date = df[date_column].max()

print()
print("Latest arrest date:", latest_date)

latest = df[
    df[date_column].dt.date == latest_date.date()
]

print("ICE arrests on latest available day:", len(latest))
