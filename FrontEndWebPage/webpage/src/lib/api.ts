const API = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export type Location = { id: string; name: string };
export type Summary = {
  country: string;
  measure: string;
  records: number;
  start_year: number;
  end_year: number;
  value_sum: number;
  value_avg: number;
};
export type Point = { bucket: number | string; value: number };
export type Profile = {
  country: string;
  year: number;
  production: Record<string, number | null>;
  consumption: Record<string, number | null>;
  biocapacity: Record<string, number | null>;
  meta: { region?: string; income_group?: string };
};

export async function getYears(): Promise<number[]> {
  const r = await fetch(`${API}/years`, { cache: "no-store" });
  return r.json();
}
export async function getMeasures(): Promise<string[]> {
  const r = await fetch(`${API}/measures`, { cache: "no-store" });
  return r.json();
}
export async function getLocations(): Promise<Location[]> {
  const r = await fetch(`${API}/locations`, { cache: "no-store" });
  return r.json();
}
export async function getSummary(country: string, measure: string, from?: number, to?: number): Promise<Summary> {
  const qs = new URLSearchParams({ measure });
  if (from) qs.set("from", String(from));
  if (to) qs.set("to", String(to));
  const r = await fetch(`${API}/locations/${encodeURIComponent(country)}/summary?${qs}`, { cache: "no-store" });
  return r.json();
}
export async function getTimeseries(country: string, measure: string, from?: number, to?: number): Promise<Point[]> {
  const qs = new URLSearchParams({ measure });
  if (from) qs.set("from", String(from));
  if (to) qs.set("to", String(to));
  const r = await fetch(`${API}/locations/${encodeURIComponent(country)}/timeseries?${qs}`, { cache: "no-store" });
  return r.json();
}
export async function getProfile(country: string, year?: number): Promise<Profile> {
  const qs = new URLSearchParams();
  if (year) qs.set("year", String(year));
  const r = await fetch(`${API}/locations/${encodeURIComponent(country)}/profile?${qs}`, { cache: "no-store" });
  return r.json();
}
