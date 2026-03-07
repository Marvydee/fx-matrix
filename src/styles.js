const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans+Condensed:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --void:      #040608;
    --deep:      #080c10;
    --surface:   #0d1117;
    --raised:    #111820;
    --border:    #1e2d3d;
    --border2:   #162030;
    --teal:      #00d4c8;
    --teal2:     #00a89e;
    --teal-dim:  rgba(0,212,200,0.08);
    --teal-glow: rgba(0,212,200,0.18);
    --green:     #00e676;
    --red:       #ff3d57;
    --amber:     #ffab00;
    --text:      #cdd9e5;
    --muted:     #4d6175;
    --muted2:    #2d4055;
    --mono:      'IBM Plex Mono', monospace;
    --cond:      'IBM Plex Sans Condensed', sans-serif;
  }

  html, body { height: 100%; }

  body {
    font-family: var(--mono);
    background: var(--void);
    color: var(--text);
    min-height: 100vh;
    background-image:
      linear-gradient(rgba(0,212,200,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,200,0.022) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  /* ── TOPBAR ── */
  .topbar {
    background: var(--teal);
    color: var(--void);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.45rem 1.5rem;
    font-family: var(--cond);
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
  }
  .topbar-right { display: flex; align-items: center; gap: 1.5rem; font-weight: 400; }
  .live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--void); display: inline-block;
    margin-right: 4px;
    animation: livepulse 1.8s ease-in-out infinite;
  }
  @keyframes livepulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(0.7); }
  }

  /* ── LAYOUT — CSS Grid, two columns ── */
  .app {
    max-width: 1100px; margin: 0 auto;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: 1fr 320px;
    grid-template-areas:
      "hdr  hdr"
      "conv rates"
      "chart rates";
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    min-height: calc(100vh - 34px);
  }

  .panel {
    background: var(--surface);
    padding: 1.25rem 1.5rem;
  }
  .panel-label {
    font-family: var(--cond); font-size: 0.65rem; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
    margin-bottom: 1rem;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .panel-label svg { color: var(--teal); }
  .panel-label::after { content:''; flex:1; height:1px; background:var(--border2); }

  /* ── HEADER ── */
  .header-panel {
    grid-area: hdr;
    background: var(--deep);
    padding: 1.25rem 1.5rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
  }
  .brand-name {
    font-family: var(--cond); font-size: 1.5rem; font-weight: 700;
    letter-spacing: 2px; color: var(--teal); text-transform: uppercase;
  }
  .brand-sub { font-size: 0.65rem; color: var(--muted); letter-spacing: 2px; margin-left: 0.6rem; }
  .header-meta { display: flex; align-items: center; gap: 2rem; font-size: 0.72rem; color: var(--muted); flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 0.4rem; }
  .meta-item svg { color: var(--teal2); }

  /* ── CONVERTER ── */
  .converter-panel { grid-area: conv; }

  .result-display {
    background: var(--deep); border: 1px solid var(--border);
    padding: 1.75rem; margin-bottom: 1.25rem;
    position: relative; overflow: hidden;
  }
  .result-display::after {
    content: ''; position: absolute;
    bottom: -40px; left: 50%; transform: translateX(-50%);
    width: 220px; height: 90px;
    background: var(--teal-glow);
    border-radius: 50%; filter: blur(35px); pointer-events: none;
  }
  .result-from { font-size: 0.7rem; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; }
  .result-amount {
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 600;
    color: var(--text); letter-spacing: -1px; line-height: 1; margin-bottom: 0.4rem;
  }
  .result-to {
    font-size: clamp(1.3rem, 3vw, 2rem); color: var(--teal);
    font-weight: 500; letter-spacing: -0.5px; min-height: 2rem;
  }
  .result-meta { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
  .rate-pill {
    background: var(--teal-dim); border: 1px solid var(--teal2);
    color: var(--teal); padding: 0.15rem 0.5rem;
    font-size: 0.68rem; letter-spacing: 1px;
  }
  .rate-pill.muted { color: var(--muted); background: none; border-color: var(--border); }
  .change-pill {
    padding: 0.15rem 0.5rem; font-size: 0.68rem;
    display: flex; align-items: center; gap: 0.25rem; border: 1px solid;
  }
  .change-pill.up   { color: var(--green); border-color: rgba(0,230,118,0.3); background: rgba(0,230,118,0.07); }
  .change-pill.down { color: var(--red);   border-color: rgba(255,61,87,0.3);  background: rgba(255,61,87,0.07); }
  .change-pill.flat { color: var(--muted); border-color: var(--border); }

  /* Presets */
  .presets { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.85rem; }
  .preset-btn {
    background: var(--raised); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer;
    padding: 0.25rem 0.65rem;
    font-family: var(--mono); font-size: 0.7rem;
    transition: all 0.15s;
  }
  .preset-btn:hover { border-color: var(--teal); color: var(--teal); background: var(--teal-dim); }

  /* Controls */
  .controls { display: grid; grid-template-columns: 1fr 42px 1fr; gap: 0.6rem; align-items: flex-end; margin-bottom: 0.6rem; }
  .inp-group { display: flex; flex-direction: column; gap: 0.35rem; }
  .inp-label { font-size: 0.62rem; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; }

  .amount-input {
    background: var(--raised); border: 1px solid var(--border);
    color: var(--text); font-family: var(--mono);
    font-size: 1.1rem; font-weight: 500;
    padding: 0.75rem 1rem; outline: none; width: 100%;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .amount-input:focus { border-color: var(--teal); box-shadow: 0 0 0 1px var(--teal), inset 0 0 20px rgba(0,212,200,0.04); }
  .amount-input::-webkit-inner-spin-button { -webkit-appearance: none; }

  .swap-btn {
    background: var(--teal); border: none;
    color: var(--void); width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.15s; align-self: flex-end;
  }
  .swap-btn:hover { background: var(--teal2); }
  .swap-btn.spinning svg { animation: spinOnce 0.4s ease; }
  @keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(180deg); } }

  /* Currency trigger */
  .cur-wrap { position: relative; }
  .cur-trigger {
    background: var(--raised); border: 1px solid var(--border); color: var(--text);
    padding: 0.75rem 2.5rem 0.75rem 0.9rem;
    font-family: var(--mono); font-size: 0.9rem; font-weight: 500;
    cursor: pointer; width: 100%; text-align: left;
    display: flex; align-items: center; gap: 0.6rem;
    transition: border-color 0.15s; letter-spacing: 1px;
  }
  .cur-trigger:hover { border-color: var(--teal); }
  .cur-chevron { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
  .cur-flag { font-size: 1.1rem; }

  /* To row */
  .to-row { margin-top: 0.6rem; }

  /* Refresh */
  .refresh-row { display: flex; align-items: center; justify-content: space-between; margin-top: 1rem; }
  .refresh-btn {
    background: none; border: 1px solid var(--border); color: var(--muted); cursor: pointer;
    padding: 0.35rem 0.75rem; font-family: var(--mono); font-size: 0.68rem;
    letter-spacing: 1px; text-transform: uppercase;
    display: flex; align-items: center; gap: 0.4rem; transition: all 0.15s;
  }
  .refresh-btn:hover { border-color: var(--teal); color: var(--teal); }
  .refresh-btn.spinning svg { animation: spin360 0.6s linear; }
  @keyframes spin360 { to { transform: rotate(360deg); } }
  .last-upd { font-size: 0.65rem; color: var(--muted); display: flex; align-items: center; gap: 0.35rem; }
  .last-upd svg { color: var(--teal2); }

  /* ── CHART ── */
  .chart-panel { grid-area: chart; }
  .chart-wrap { height: 190px; }
  .chart-tip {
    background: var(--raised); border: 1px solid var(--border);
    padding: 0.5rem 0.75rem; font-size: 0.7rem;
  }
  .chart-tip .cv { color: var(--teal); font-weight: 600; font-size: 0.82rem; }
  .chart-tip .cl { color: var(--muted); }

  /* ── DROPDOWN ── */
  .drop-overlay {
    position: fixed; inset: 0; z-index: 600;
    background: rgba(4,6,8,0.88);
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 8vh;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  .drop-box {
    background: var(--surface); border: 1px solid var(--border);
    width: 100%; max-width: 420px; max-height: 70vh;
    display: flex; flex-direction: column;
    animation: dropIn 0.2s ease;
    box-shadow: 0 40px 80px rgba(0,0,0,0.85);
  }
  @keyframes dropIn { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }
  .drop-head {
    padding: 0.85rem 1rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 0.6rem; background: var(--deep);
  }
  .drop-head svg { color: var(--teal); }
  .drop-search {
    flex:1; background:none; border:none; outline:none;
    color: var(--text); font-family: var(--mono); font-size: 0.88rem;
    caret-color: var(--teal);
  }
  .drop-search::placeholder { color: var(--muted); }
  .drop-close { background:none; border:none; color:var(--muted); cursor:pointer; display:flex; align-items:center; transition:color 0.15s; }
  .drop-close:hover { color: var(--text); }
  .drop-list { overflow-y: auto; flex:1; }
  .drop-item {
    padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem;
    cursor: pointer; border-bottom: 1px solid var(--border2);
    transition: background 0.1s; font-size: 0.82rem;
  }
  .drop-item:hover, .drop-item.sel { background: var(--teal-dim); }
  .drop-code { color: var(--teal); font-weight: 600; min-width: 44px; letter-spacing: 1px; }
  .drop-name { color: var(--muted); font-size: 0.72rem; flex:1; }
  .drop-flag { font-size: 1.1rem; flex-shrink: 0; }
  .fav-btn { background:none; border:none; cursor:pointer; display:flex; color:var(--muted); transition:color 0.15s; }
  .fav-btn.on { color: var(--amber); }

  /* ── RATES SIDEBAR ── */
  .rates-panel { grid-area: rates; }
  .rates-list { display: flex; flex-direction: column; gap: 1px; background: var(--border2); }
  .rate-row {
    background: var(--surface); padding: 0.7rem 0.75rem;
    display: grid; grid-template-columns: auto 1fr auto;
    gap: 0.6rem; align-items: center; cursor: pointer; transition: background 0.1s;
  }
  .rate-row:hover { background: var(--raised); }
  .rate-row.active { background: var(--teal-dim); border-left: 2px solid var(--teal); }
  .r-flag { font-size: 1rem; }
  .r-code { font-size: 0.78rem; font-weight: 600; color: var(--text); letter-spacing: 1px; }
  .r-name { font-size: 0.62rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .r-val  { font-size: 0.82rem; font-weight: 600; text-align: right; }
  .r-chg  { font-size: 0.62rem; display: flex; align-items: center; justify-content: flex-end; gap: 0.2rem; }
  .r-chg.up   { color: var(--green); }
  .r-chg.down { color: var(--red); }
  .r-chg.flat { color: var(--muted); }

  /* ── STATES ── */
  .loading-st { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 3rem; color: var(--muted); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 1.5px; }
  .loading-st svg { animation: spin360 1s linear infinite; color: var(--teal); }
  .error-st { padding: 1rem; background: rgba(255,61,87,0.07); border: 1px solid rgba(255,61,87,0.3); color: var(--red); font-size: 0.78rem; margin-top: 0.75rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 780px) {
    .app { grid-template-columns: 1fr; grid-template-areas: "hdr" "conv" "chart" "rates"; }
    .rates-list { display: grid; grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .controls { grid-template-columns: 1fr 42px 1fr; }
    .topbar-right { display: none; }
    .rates-list { grid-template-columns: 1fr; }
    .app { padding: 1rem; }
  }
`;

export default styles;
