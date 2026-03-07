import React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X, Star, StarOff } from "lucide-react";
import { CURRENCIES } from "../utils/data";
import { getCur } from "../utils/helpers";

function CurrencyDropdown({
  value,
  onChange,
  favorites,
  onToggleFav,
  exclude,
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef(null);
  const cur = getCur(value);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  // Filter by code or name, exclude the other selected currency
  const filtered = CURRENCIES.filter(
    (c) =>
      c.code !== exclude &&
      (c.code.includes(q.toUpperCase()) ||
        c.name.toLowerCase().includes(q.toLowerCase())),
  );
  // Favorites rise to the top
  const sorted = [
    ...filtered.filter((c) => favorites.has(c.code)),
    ...filtered.filter((c) => !favorites.has(c.code)),
  ];

  return (
    <>
      <div className="cur-wrap">
        <button className="cur-trigger" onClick={() => setOpen(true)}>
          <span className="cur-flag">{cur.flag}</span>
          <span>{cur.code}</span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--muted)",
              marginLeft: "auto",
              paddingRight: "1.2rem",
            }}
          >
            {cur.name}
          </span>
        </button>
        <ChevronDown size={14} className="cur-chevron" />
      </div>

      {open && (
        <div className="drop-overlay" onClick={() => setOpen(false)}>
          <div className="drop-box" onClick={(e) => e.stopPropagation()}>
            <div className="drop-head">
              <Search size={14} />
              <input
                ref={searchRef}
                className="drop-search"
                placeholder="Search currency or code..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button className="drop-close" onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="drop-list">
              {sorted.map((c) => (
                <div
                  key={c.code}
                  className={`drop-item ${c.code === value ? "sel" : ""}`}
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  <span className="drop-flag">{c.flag}</span>
                  <span className="drop-code">{c.code}</span>
                  <span className="drop-name">{c.name}</span>
                  {/* Star button — stops propagation so clicking it
                      doesn't also select and close the dropdown */}
                  <button
                    className={`fav-btn ${favorites.has(c.code) ? "on" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFav(c.code);
                    }}
                  >
                    {favorites.has(c.code) ? (
                      <Star size={13} fill="currentColor" />
                    ) : (
                      <StarOff size={13} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CurrencyDropdown;
