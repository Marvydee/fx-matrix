import { CURRENCIES } from "./data";

function getCur(code) {
  return (
    CURRENCIES.find((c) => c.code === code) || { code, name: code, flag: "🌐" }
  );
}

function fmt(n, d = 4) {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: d,
  });
}

function buildHistory(rate, days = 30) {
  let v = rate * (0.94 + Math.random() * 0.06);
  return Array.from({ length: days + 1 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    v = i === days ? rate : v * (1 + (Math.random() - 0.5) * 0.03);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: parseFloat(v.toFixed(4)),
    };
  });
}

// Seeded random per currency code so sidebar changes don't flicker on re-render
function stableChange(code) {
  let h = 0;
  for (const c of code) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return (((h % 400) - 200) / 100).toFixed(2);
}

export { getCur, fmt, buildHistory, stableChange };
