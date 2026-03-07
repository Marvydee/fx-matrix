import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Activity,
  Clock,
  Globe2,
  Minus,
  BarChart2,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styles from "../styles";
import { CURRENCIES, PRESETS, SIDEBAR_CODES } from "../utils/data";
import { getCur, fmt, buildHistory, stableChange } from "../utils/helpers";
import ChartTip from "../utils/toolTip";
import CurrencyDropdown from "./CurrencyDropdown";

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("NGN");
  // rates = { EUR: 0.92, GBP: 0.79, NGN: 1520, ... } — relative to 'from'
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [history, setHistory] = useState([]);
  // favorites = Set of starred currency codes
  const [favorites, setFavorites] = useState(new Set(["EUR", "GBP", "NGN"]));
  const [swapSpin, setSwapSpin] = useState(false);
  const [refreshSpin, setRefresh] = useState(false);

  const rate = rates?.[to] ?? null;
  const converted = rate != null ? amount * rate : null;

  // ── FETCH from Frankfurter API ────────────────────────────────────────────
  // Frankfurter.app: free, no key, no rate limit for reasonable usage.
  // Returns all rates vs a base currency in a single request.
  const fetchRates = useCallback(async (base) => {
    setError("");
    try {
      const res = await fetch(
        `https://api.frankfurter.app/latest?base=${base}`,
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      // Include the base itself (1:1) so the sidebar can show it
      setRates({ ...data.rates, [base]: 1 });
      setUpdatedAt(new Date());
    } catch {
      setError("Could not load rates. Check your connection and try again.");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(
    () => {
      fetchRates(from);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Rebuild chart history whenever the target rate changes
  useEffect(() => {
    if (rate) setHistory(buildHistory(rate));
  }, [rate]);

  // ── HANDLERS ─────────────────────────────────────────────────────────────
  function handleFromChange(code) {
    setFrom(code);
    setLoading(true);
    fetchRates(code);
  }

  function handleSwap() {
    setSwapSpin(true);
    setTimeout(() => setSwapSpin(false), 420);
    const prevFrom = from,
      prevTo = to;
    setTo(prevFrom);
    handleFromChange(prevTo);
  }

  function handleRefresh() {
    setRefresh(true);
    fetchRates(from);
  }

  function toggleFav(code) {
    setFavorites((prev) => {
      const n = new Set(prev);
      n.has(code) ? n.delete(code) : n.add(code);
      return n;
    });
  }

  // 30-day trend direction based on first vs last history point
  const h0 = history[0]?.rate;
  const hN = history[history.length - 1]?.rate;
  const dir = !h0 ? "flat" : hN > h0 ? "up" : hN < h0 ? "down" : "flat";
  const changePct = h0 ? (((hN - h0) / h0) * 100).toFixed(2) : null;

  const timeSince = updatedAt
    ? `${Math.floor((Date.now() - updatedAt) / 1000)}s ago`
    : "fetching...";

  // Chart line colour follows the trend direction
  const lineColor =
    dir === "up"
      ? "var(--green)"
      : dir === "down"
        ? "var(--red)"
        : "var(--teal)";

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>

      {/* Topbar */}
      <div className="topbar">
        <span>FX Terminal · Live</span>
        <div className="topbar-right">
          <span>
            <span className="live-dot" />
            Live Rates
          </span>
          <span>Frankfurter API · No Key Required</span>
        </div>
      </div>

      <div className="app">
        {/* ── Header ── */}
        <div className="header-panel">
          <div>
            <span className="brand-name">
              FX<span style={{ color: "var(--text)" }}>Convert</span>
            </span>
            <span className="brand-sub"> real-time exchange rates</span>
          </div>
          <div className="header-meta">
            <span className="meta-item">
              <Globe2 size={12} /> {CURRENCIES.length} Currencies
            </span>
            <span className="meta-item">
              <Zap size={12} /> No API Key
            </span>
            <span className="meta-item">
              <Activity size={12} /> Frankfurter API
            </span>
            <span className="meta-item">
              <Clock size={12} /> Updated {timeSince}
            </span>
          </div>
        </div>

        {/* ── Converter panel ── */}
        <div className="panel converter-panel">
          <div className="panel-label">
            <BarChart2 size={12} /> Converter
          </div>

          {/* Result display — the hero element of this panel */}
          <div className="result-display">
            <div className="result-from">
              {fmt(amount, 2)} {getCur(from).name}
            </div>
            <div className="result-amount">
              {fmt(amount, 2)}
              <span
                style={{
                  color: "var(--muted)",
                  fontSize: "0.45em",
                  marginLeft: "0.3em",
                }}
              >
                {from}
              </span>
            </div>
            <div className="result-to">
              {loading
                ? "Fetching rates..."
                : error
                  ? "—"
                  : `${fmt(converted, 2)} ${to}`}
            </div>
            <div className="result-meta">
              {rate && (
                <>
                  <span className="rate-pill">
                    1 {from} = {fmt(rate)} {to}
                  </span>
                  <span className="rate-pill muted">
                    1 {to} = {fmt(1 / rate)} {from}
                  </span>
                  {changePct && (
                    <span className={`change-pill ${dir}`}>
                      {dir === "up" ? (
                        <TrendingUp size={11} />
                      ) : dir === "down" ? (
                        <TrendingDown size={11} />
                      ) : (
                        <Minus size={11} />
                      )}
                      {dir === "up" ? "+" : ""}
                      {changePct}% 30d
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick-amount presets */}
          <div className="presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                className="preset-btn"
                onClick={() => setAmount(p)}
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Amount input + swap + FROM currency */}
          <div className="controls">
            <div className="inp-group">
              <div className="inp-label">Amount</div>
              <input
                className="amount-input"
                type="number"
                value={amount}
                min={0}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="inp-group">
              <div className="inp-label" style={{ opacity: 0 }}>
                _
              </div>
              <button
                className={`swap-btn ${swapSpin ? "spinning" : ""}`}
                onClick={handleSwap}
                title="Swap currencies"
              >
                <ArrowLeftRight size={16} />
              </button>
            </div>

            <div className="inp-group">
              <div className="inp-label">From</div>
              <CurrencyDropdown
                value={from}
                onChange={handleFromChange}
                favorites={favorites}
                onToggleFav={toggleFav}
                exclude={to}
              />
            </div>
          </div>

          {/* TO currency on its own row — full width */}
          <div className="to-row">
            <div
              className="inp-label"
              style={{
                fontSize: "0.62rem",
                color: "var(--muted)",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "0.35rem",
              }}
            >
              To
            </div>
            <CurrencyDropdown
              value={to}
              onChange={setTo}
              favorites={favorites}
              onToggleFav={toggleFav}
              exclude={from}
            />
          </div>

          {/* Refresh */}
          <div className="refresh-row">
            <span className="last-upd">
              <Clock size={11} /> Updated {timeSince}
            </span>
            <button
              className={`refresh-btn ${refreshSpin ? "spinning" : ""}`}
              onClick={handleRefresh}
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          {error && <div className="error-st">{error}</div>}
        </div>

        {/* ── Chart panel ── */}
        <div className="panel chart-panel">
          <div className="panel-label">
            <Activity size={12} />
            {from}/{to} · 30-Day Trend
            <span
              style={{
                marginLeft: "auto",
                fontSize: "0.6rem",
                color: "var(--muted)",
              }}
            >
              * Simulated from live rate
            </span>
          </div>

          {history.length > 0 ? (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={history}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <ReferenceLine
                    y={rate}
                    stroke="rgba(0,212,200,0.2)"
                    strokeDasharray="4 4"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "#4d6175",
                      fontSize: 9,
                      fontFamily: "IBM Plex Mono",
                    }}
                    tickLine={false}
                    axisLine={false}
                    interval={6}
                  />
                  <YAxis
                    tick={{
                      fill: "#4d6175",
                      fontSize: 9,
                      fontFamily: "IBM Plex Mono",
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={60}
                    tickFormatter={(v) => fmt(v, 2)}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<ChartTip to={to} />} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={lineColor}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "var(--teal)",
                      stroke: "var(--surface)",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="loading-st" style={{ height: 190 }}>
              <RefreshCw size={20} /> Building chart...
            </div>
          )}
        </div>

        {/* ── Rates sidebar ── */}
        <div className="panel rates-panel">
          <div className="panel-label">
            <TrendingUp size={12} /> Rates vs {from}
          </div>

          {loading ? (
            <div className="loading-st">
              <RefreshCw size={18} /> Loading...
            </div>
          ) : error ? (
            <div className="error-st">{error}</div>
          ) : (
            <div className="rates-list">
              {SIDEBAR_CODES.filter((c) => c !== from).map((code) => {
                const r = rates?.[code];
                const cur = getCur(code);
                const chg = parseFloat(stableChange(code + from)); // deterministic per pair
                const chgDir = chg > 0 ? "up" : chg < 0 ? "down" : "flat";
                return (
                  <div
                    key={code}
                    className={`rate-row ${to === code ? "active" : ""}`}
                    onClick={() => setTo(code)}
                    title={`Use ${code} as target`}
                  >
                    <span className="r-flag">{cur.flag}</span>
                    <div>
                      <div className="r-code">{code}</div>
                      <div className="r-name">{cur.name}</div>
                    </div>
                    <div>
                      <div className="r-val">{r ? fmt(r, 3) : "—"}</div>
                      <div className={`r-chg ${chgDir}`}>
                        {chgDir === "up" ? (
                          <TrendingUp size={9} />
                        ) : chgDir === "down" ? (
                          <TrendingDown size={9} />
                        ) : (
                          <Minus size={9} />
                        )}
                        {chgDir !== "flat"
                          ? `${chg > 0 ? "+" : ""}${chg}%`
                          : "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
