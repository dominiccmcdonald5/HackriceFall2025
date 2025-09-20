import { Router } from "express";
import { pool } from "../db.js";
const r = Router();

r.get("/locations", async (_req, res) => {
  const [rows] = await pool.query("SELECT id, name, code FROM locations ORDER BY name");
  res.json(rows);
});

r.get("/locations/:id/summary", async (req, res) => {
  const { id } = req.params, { from, to } = req.query;
  const where = ["location_id = ?"], params = [id];
  if (from) { where.push("ts >= ?"); params.push(from); }
  if (to)   { where.push("ts <= ?"); params.push(to); }
  const [rows] = await pool.query(`
    SELECT COUNT(*) records, MIN(ts) start_date, MAX(ts) end_date,
           SUM(metric_a) metric_a_sum, AVG(metric_a) metric_a_avg
    FROM facts WHERE ${where.join(" AND ")}`, params);
  res.json(rows[0] ?? {});
});

r.get("/locations/:id/timeseries", async (req, res) => {
  const { id } = req.params;
  const { metric = "metric_a", from, to, group = "month" } = req.query;
  const safe = ["metric_a","metric_b","metric_c"];
  const m = safe.includes(metric) ? metric : "metric_a";
  const bucket = group==="week" ? "STR_TO_DATE(CONCAT(YEARWEEK(ts,3),' Monday'),'%X%V %W')"
               : group==="day"  ? "DATE(ts)"
               : "DATE_FORMAT(ts,'%Y-%m-01')";
  const where = ["location_id=?"], params = [id];
  if (from) { where.push("ts >= ?"); params.push(from); }
  if (to)   { where.push("ts <= ?"); params.push(to); }
  const [rows] = await pool.query(
    `SELECT ${bucket} bucket, SUM(${m}) value
     FROM facts WHERE ${where.join(" AND ")}
     GROUP BY bucket ORDER BY bucket`, params);
  res.json(rows);
});

export default r;
