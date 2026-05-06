export function MemoryCard({ card, onClick }) {
  const { isFlipped, isMatched, symbol, color, glow } = card;
  const revealed = isFlipped || isMatched;

  return (
    <div
      className={`mem-card${revealed ? " mem-card--flipped" : ""}${isMatched ? " mem-card--matched" : ""}`}
      onClick={onClick}
      role="button"
      aria-label={revealed ? symbol : "hidden"}
    >
      <div className="mem-card-inner">
        <div className="mem-card-face mem-card-back">
          <span className="mem-card-rune">✦</span>
        </div>
        <div
          className="mem-card-face mem-card-front"
          style={{ "--glyph-color": color, "--glyph-glow": glow }}
        >
          {symbol}
        </div>
      </div>
    </div>
  );
}
