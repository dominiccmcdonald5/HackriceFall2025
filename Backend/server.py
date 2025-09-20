# server.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

from pathlib import Path
CSV_PATH = str(Path(__file__).with_name("rice.csv"))

df = pd.read_csv(CSV_PATH).rename(columns={
    "Reference area": "reference_area",
    "REF_AREA": "ref_area",
    "TIME_PERIOD": "year",
    "OBS_VALUE": "value",
    "Unit of measure": "unit_measure",
    "MEASURE": "measure"
})
df["year"] = pd.to_numeric(df["year"], errors="coerce")
df = df.dropna(subset=["year"])
df["year"] = df["year"].astype(int)

app = FastAPI(title="CSV Analytics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/locations")
def locations():
    return (
        df[["ref_area", "reference_area"]]
        .drop_duplicates().sort_values("reference_area")
        .rename(columns={"ref_area":"id","reference_area":"name"})
        .to_dict(orient="records")
    )

@app.get("/locations/{area}/summary")
def summary(area: str, from_: str | None = Query(None, alias="from"), to: str | None = None, measure: str | None = None):
    g = df[df["ref_area"] == area].copy()
    if measure: g = g[g["measure"] == measure]
    if from_:   g = g[g["year"] >= int(from_)]
    if to:      g = g[g["year"] <= int(to)]
    if g.empty: return {}
    return {
        "records": int(g.shape[0]),
        "start_date": f"{int(g['year'].min())}-01-01",
        "end_date": f"{int(g['year'].max())}-12-31",
        "value_sum": float(g["value"].sum()),
        "value_avg": float(g["value"].mean()),
        "unit": (g["unit_measure"].dropna().iloc[0] if "unit_measure" in g and not g["unit_measure"].dropna().empty else None),
        "measure": measure or "ALL"
    }

@app.get("/locations/{area}/timeseries")
def timeseries(area: str, from_: str | None = Query(None, alias="from"), to: str | None = None, measure: str | None = None):
    g = df[df["ref_area"] == area].copy()
    if measure: g = g[g["measure"] == measure]
    if from_:   g = g[g["year"] >= int(from_)]
    if to:      g = g[g["year"] <= int(to)]
    if g.empty: return []
    ts = g.groupby("year", as_index=False)["value"].sum().sort_values("year")
    return [{"bucket": int(r.year), "value": float(r.value)} for _, r in ts.iterrows()]

@app.get("/", include_in_schema=False)
def root(): return {"ok": True}
