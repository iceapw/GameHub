import { useEffect, useRef, useState } from "react";

const PAIRS = [
  { symbol: "◆", color: "#818cf8", glow: "rgba(129,140,248,0.9)" },
  { symbol: "★", color: "#c084fc", glow: "rgba(192,132,252,0.9)" },
  { symbol: "●", color: "#f472b6", glow: "rgba(244,114,182,0.9)" },
  { symbol: "▲", color: "#34d399", glow: "rgba(52,211,153,0.9)"  },
  { symbol: "■", color: "#fbbf24", glow: "rgba(251,191,36,0.9)"  },
  { symbol: "⊕", color: "#60a5fa", glow: "rgba(96,165,250,0.9)"  },
];

// 4×3 grid — fixed pair layout (pair index per cell, A or B of the pair)
const GRID = [
  { pair: 0, side: "a" }, { pair: 3, side: "a" }, { pair: 1, side: "a" }, { pair: 4, side: "a" },
  { pair: 2, side: "a" }, { pair: 0, side: "b" }, { pair: 5, side: "a" }, { pair: 1, side: "b" },
  { pair: 3, side: "b" }, { pair: 4, side: "b" }, { pair: 2, side: "b" }, { pair: 5, side: "b" },
];

const SIZE = 58;
const GAP  = 7;

// Animation phases per pair: flip A → flip B → glow match → pause → next
const PHASE_MS = { flipA: 0, flipB: 480, glow: 850, next: 1700 };

function MiniCard({ pairIdx, matchedSet, flipASet, flipBSet }) {
  const pair    = PAIRS[pairIdx];
  const isA     = flipASet.has(pairIdx);
  const isB     = flipBSet.has(pairIdx);
  const matched = matchedSet.has(pairIdx);
  const revealed = isA || isB || matched;

  return (
    <div style={{ perspective: "240px", width: SIZE, height: SIZE }}>
      <div
        style={{
          width: "100%", height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back */}
        <div
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 6,
            border: "1px solid rgba(129,140,248,0.18)",
            background: "rgba(129,140,248,0.04)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
            color: "rgba(129,140,248,0.2)",
          }}
        >
          ✦
        </div>
        {/* Front */}
        <div
          style={{
            position: "absolute", inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 6,
            border: `1px solid ${matched ? pair.color : "rgba(255,255,255,0.07)"}`,
            background: matched ? `${pair.color}14` : "rgba(255,255,255,0.03)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.4rem",
            color: pair.color,
            textShadow: matched
              ? `0 0 22px ${pair.glow}, 0 0 8px ${pair.glow}`
              : `0 0 10px ${pair.glow}`,
            boxShadow: matched ? `0 0 14px ${pair.glow}` : "none",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease",
          }}
        >
          {pair.symbol}
        </div>
      </div>
    </div>
  );
}

export function MemoryPreview({ isActive }) {
  const [matchedSet, setMatchedSet] = useState(new Set());
  const [flipASet, setFlipASet]     = useState(new Set());
  const [flipBSet, setFlipBSet]     = useState(new Set());

  const activePairRef = useRef(0);
  const timersRef     = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const schedule = (fn, delay) => {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  };

  useEffect(() => {
    if (!isActive) {
      clearTimers();
      setMatchedSet(new Set());
      setFlipASet(new Set());
      setFlipBSet(new Set());
      activePairRef.current = 0;
      return;
    }

    const runPair = () => {
      const p = activePairRef.current;

      // Flip A card
      schedule(() => setFlipASet((s) => new Set([...s, p])), PHASE_MS.flipA);

      // Flip B card
      schedule(() => setFlipBSet((s) => new Set([...s, p])), PHASE_MS.flipB);

      // Mark matched (glow), clear A/B flip states
      schedule(() => {
        setMatchedSet((s) => new Set([...s, p]));
        setFlipASet((s) => { const n = new Set(s); n.delete(p); return n; });
        setFlipBSet((s) => { const n = new Set(s); n.delete(p); return n; });
      }, PHASE_MS.glow);

      // Advance to next pair
      schedule(() => {
        activePairRef.current = (p + 1) % PAIRS.length;
        if (activePairRef.current === 0) {
          // Reset board, then restart
          setMatchedSet(new Set());
        }
        runPair();
      }, PHASE_MS.next);
    };

    runPair();
    return clearTimers;
  }, [isActive]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: "1.1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(4, ${SIZE}px)`,
          gap: GAP,
        }}
      >
        {GRID.map((cell, i) => (
          <MiniCard
            key={i}
            pairIdx={cell.pair}
            matchedSet={matchedSet}
            flipASet={cell.side === "a" ? flipASet : new Set()}
            flipBSet={cell.side === "b" ? flipBSet : new Set()}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          color: "#818cf8",
          letterSpacing: "0.22em",
          fontSize: "0.9rem",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        Symbol Match
      </p>
    </div>
  );
}
