# server.py — FastAPI + Pandas for NFBA Excel (2022 + 2024 estimate)

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List
from functools import lru_cache
from pathlib import Path
import pandas as pd

# ---- config ----
EXCEL_PATH = Path(__file__).with_name("NFBA 2025 Public Data Package_Rev 2025 09.xlsx")

# Columns you asked for (exact dashboard categories)
PROD_COLS = {
    "Cropland Footprint": "Cropland Footprint",
    "Grazing Footprint": "Grazing Footprint",
    "Forest Product Footprint": "Forest Product Footprint",
    "Carbon Footprint": "Carbon Footprint",
    "Fish Footprint": "Fish Footprint",
    "Built up land": "Built up land",
    "Total Ecological Footprint (Production)": "Total Ecological Footprint (Production)",
}
CONS_COLS = {
    "Cropland Footprint": "Cropland Footprint.1",
    "Grazing Footprint": "Grazing Footprint.1",
    "Forest Product Footprint": "Forest Product Footprint.1",
    "Carbon Footprint": "Carbon Footprint.1",
    "Fish Footprint": "Fish Footprint.1",
    "Built up land": "Built up land.1",
    "Total Ecological Footprint (Consumption)": "Total Ecological Footprint (Consumption)",
}
BIO_COLS = {
    "Cropland": "Cropland",
    "Grazing land": "Grazing land",
    "Forest land": "Forest land",
    "Fishing ground": "Fishing ground",
    "Built up land": "Built up land.2",
    "Total biocapacity": "Total biocapacity ",  # note the space in the source
}

# For simple timeseries/summary routes we’ll also expose a few friendly measures
MEASURE_MAP = {
    "EF Production (total)": "Total Ecological Footprint (Production)",
    "EF Consumption (total)": "Total Ecological Footprint (Consumption)",
    "Biocapacity (total)": "Total biocapacity",
    "Carbon Footprint (production)": "Carbon Footprint",
    "Carbon Footprint (consumption)": "Carbon Footprint.1",
}

# ---- FastAPI app ----
app = FastAPI(title="NFBA Excel Analytics API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- helpers ----
def _find_header_row(xlsx_path: Path, sheet_name: str) -> int:
    raw = pd.read_excel(xlsx_path, sheet_name=sheet_name, header=None)
    for i in range(min(200, len(raw))):
        row = raw.iloc[i].astype(str).str.strip().tolist()
        if any(v.lower() == "country" for v in row):
            return i
    raise ValueError(f"No header row with 'Country' found in {sheet_name}")

def _clean_sheet(df: pd.DataFrame) -> pd.DataFrame:
    df = df.loc[:, ~df.columns.astype(str).str.startswith("Unnamed")]
    df.columns = [str(c).strip() for c in df.columns]
    return df.dropna(how="all")

@lru_cache(maxsize=1)
def _load_sheets() -> dict:
    """Returns cleaned DataFrames for 2022 + 2024 sheets."""
    out = {}
    for sheet, year in [("Country Results (2022)", 2022),
                        ("Country Results (2024 estimate)", 2024)]:
        hdr = _find_header_row(EXCEL_PATH, sheet)
        df = pd.read_excel(EXCEL_PATH, sheet_name=sheet, header=hdr)
        df = _clean_sheet(df)
        df["year"] = year
        out[year] = df
    return out

@lru_cache(maxsize=1)
def load_wide_by_year() -> Dict[int, pd.DataFrame]:
    """Year → wide table containing requested columns + meta."""
    sheets = _load_sheets()
    keep_meta = [c for c in ["Country", "Region", "Income Group"] if c in next(iter(sheets.values())).columns]

    # ensure all referenced columns exist (fill missing with NA)
    required_cols = set(PROD_COLS.values()) | set(CONS_COLS.values()) | set(BIO_COLS.values())
    out = {}
    for y, df in sheets.items():
        for col in required_cols:
            if col not in df.columns:
                df[col] = pd.NA
        out[y] = df[keep_meta + list(required_cols)].copy()
    return out

@lru_cache(maxsize=1)
def load_long() -> pd.DataFrame:
    """Long format for timeseries/summary: Country, year, measure, value."""
    sheets = _load_sheets()
    for y, df in sheets.items():
        # fix trailing space in the source name
        if "Total biocapacity " in df.columns and "Total biocapacity" not in df.columns:
            df.rename(columns={"Total biocapacity ": "Total biocapacity"}, inplace=True)

    # select only mapped measures present in both years
    present = {k: v for k, v in MEASURE_MAP.items() if all(v in sheets[y].columns for y in sheets)}
    keep_meta = [c for c in ["Country"] if c in next(iter(sheets.values())).columns]

    frames = []
    for y, df in sheets.items():
        cols = keep_meta + list(present.values()) + ["year"]
        slim = df[cols].copy()
        slim.rename(columns={v: k for k, v in present.items()}, inplace=True)  # raw → friendly
        frames.append(slim)
    wide = pd.concat(frames, ignore_index=True)

    long = wide.melt(id_vars=keep_meta + ["year"], var_name="measure", value_name="value")
    long["value"] = pd.to_numeric(long["value"], errors="coerce")
    long = long.dropna(subset=["Country", "year", "measure", "value"])
    return long

AVAILABLE_YEARS: List[int] = sorted(load_wide_by_year().keys())
COUNTRIES: List[str] = sorted(load_long()["Country"].unique().tolist())
MEASURES: List[str] = sorted(load_long()["measure"].unique().tolist())

# ---- endpoints ----
@app.get("/years")
def years():
    return AVAILABLE_YEARS

@app.get("/measures")
def measures():
    return MEASURES

@app.get("/locations")
def locations():
    return [{"id": c, "name": c} for c in COUNTRIES]

@app.get("/locations/{country}/summary")
def summary(
    country: str,
    from_: Optional[int] = Query(None, alias="from"),
    to: Optional[int] = None,
    measure: str = "EF Consumption (total)"
):
    df = load_long()
    g = df[(df["Country"].str.lower() == country.lower()) & (df["measure"] == measure)]
    if from_ is not None:
        g = g[g["year"] >= from_]
    if to is not None:
        g = g[g["year"] <= to]
    if g.empty:
        return {}
    return {
        "country": country,
        "measure": measure,
        "records": int(g.shape[0]),
        "start_year": int(g["year"].min()),
        "end_year": int(g["year"].max()),
        "value_sum": float(g["value"].sum()),
        "value_avg": float(g["value"].mean()),
    }

@app.get("/locations/{country}/timeseries")
def timeseries(
    country: str,
    measure: str = "EF Consumption (total)",
    from_: Optional[int] = Query(None, alias="from"),
    to: Optional[int] = None
):
    df = load_long()
    g = df[(df["Country"].str.lower() == country.lower()) & (df["measure"] == measure)]
    if from_ is not None:
        g = g[g["year"] >= from_]
    if to is not None:
        g = g[g["year"] <= to]
    g = g.sort_values("year")
    return [{"bucket": int(r.year), "value": float(r.value)} for r in g.itertuples(index=False)]

@app.get("/locations/{country}/profile")
def country_profile(country: str, year: Optional[int] = None) -> Dict[str, Any]:
    """
    Returns the exact columns you asked for, grouped as:
      - production (Cropland/Grazing/Forest Product/Carbon/Fish/Built/Total)
      - consumption (same categories)
      - biocapacity (Cropland/Grazing/Forest/Fishing/Built/Total)
    """
    data_by_year = load_wide_by_year()
    y = year if year in data_by_year else AVAILABLE_YEARS[-1]  # default latest
    df = data_by_year[y]
    row = df[df["Country"].str.lower() == country.lower()]
    if row.empty:
        return {}

    r = row.iloc[0].to_dict()

    def pick(block_map: Dict[str, str]) -> Dict[str, Optional[float]]:
        out = {}
        for nice, rawcol in block_map.items():
            v = pd.to_numeric(r.get(rawcol), errors="coerce")
            out[nice] = None if pd.isna(v) else float(v)
        return out

    return {
        "country": r.get("Country"),
        "year": y,
        "production": pick(PROD_COLS),
        "consumption": pick(CONS_COLS),
        "biocapacity": pick(BIO_COLS),
        "meta": {
            "region": r.get("Region"),
            "income_group": r.get("Income Group"),
        }
    }

@app.get("/", include_in_schema=False)
def root():
    return {"ok": True, "routes": ["/years", "/measures", "/locations", "/locations/{country}/summary", "/locations/{country}/timeseries", "/locations/{country}/profile"]}