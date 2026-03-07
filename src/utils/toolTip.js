import { fmt } from "./helpers";

function ChartTip({ active, payload, label, to }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <div className="cl">{label}</div>
      <div className="cv">
        {fmt(payload[0]?.value)} {to}
      </div>
    </div>
  );
}

export default ChartTip;
