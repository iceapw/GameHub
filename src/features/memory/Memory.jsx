import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemoryCard } from "./components/MemoryCard";
import { useMemoryGame, DIFFICULTY_CONFIG } from "./logic/useMemoryGame";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import { RoomPlayerBadge } from "../../components/game-room/RoomPlayerBadge";
import "../../styles/PokemonGame.css";
import "../../styles/Memory.css";

function formatTime(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const DIFF_META = {
  easy:   { color: "#34d399", grid: "4 × 3", hint: "Cards stay visible longer" },
  normal: { color: "#818cf8", grid: "4 × 4", hint: "Balanced challenge"        },
  hard:   { color: "#f472b6", grid: "5 × 4", hint: "Fast flip, sharp memory"   },
};

function MemoryLobby({ difficulty, onSelect, onStart }) {
  return (
    <div className="mem-lobby">
      <p className="mem-lobby-label">Choose Difficulty</p>
      <div className="mem-diff-cards">
        {Object.keys(DIFFICULTY_CONFIG).map((d) => {
          const cfg  = DIFFICULTY_CONFIG[d];
          const meta = DIFF_META[d];
          const active = difficulty === d;
          return (
            <button
              key={d}
              type="button"
              className={`mem-diff-card${active ? " mem-diff-card--active" : ""}`}
              style={{ "--diff-color": meta.color }}
              onClick={() => onSelect(d)}
            >
              <span className="mem-diff-card-name">{cfg.label}</span>
              <span className="mem-diff-card-grid">{meta.grid}</span>
              <span className="mem-diff-card-pairs">{cfg.pairs} pairs</span>
              <span className="mem-diff-card-hint">{meta.hint}</span>
            </button>
          );
        })}
      </div>
      <button className="pg-btn pg-btn-guess" type="button" onClick={onStart}>
        Start Game
      </button>
    </div>
  );
}

function MemoryBoard({ difficulty, onBackToLobby }) {
  const { cards, moves, elapsed, status, config, flipCard, newGame } =
    useMemoryGame(difficulty);

  return (
    <div className="mem-board">
      <div className="mem-stats-bar">
        <span className="mem-stat">
          <span className="mem-stat-label">Moves</span>
          <span className="mem-stat-value">{moves}</span>
        </span>
        <span className="mem-stat">
          <span className="mem-stat-label">Time</span>
          <span className="mem-stat-value">{formatTime(elapsed)}</span>
        </span>
      </div>

      <div className="mem-grid" style={{ "--cols": config.cols, "--rows": config.rows }}>
        {cards.map((card, idx) => (
          <MemoryCard key={card.id} card={card} onClick={() => flipCard(idx)} />
        ))}
      </div>

      {status === "won" && (
        <div className="mem-win">
          <div className="mem-win-box">
            <p className="mem-win-title">All Symbols Matched!</p>
            <p className="mem-win-stats">
              {moves} moves &nbsp;·&nbsp; {formatTime(elapsed)}
            </p>
            <div className="mem-win-actions">
              <button className="mem-win-btn" onClick={newGame} type="button">
                Play Again
              </button>
              <button className="mem-win-btn mem-win-btn--ghost" onClick={onBackToLobby} type="button">
                Change Difficulty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Memory() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");

  return (
    <div className="pg-wrapper mem-wrapper">
      <GameRoomHeader title="Symbol Match" onBackToLobby={() => navigate("/")} />
      <RoomPlayerBadge name={playerName} />

      {started ? (
        <MemoryBoard difficulty={difficulty} onBackToLobby={() => setStarted(false)} />
      ) : (
        <MemoryLobby
          difficulty={difficulty}
          onSelect={setDifficulty}
          onStart={() => setStarted(true)}
        />
      )}
    </div>
  );
}
