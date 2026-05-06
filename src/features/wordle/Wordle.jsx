import { useNavigate } from "react-router-dom";
import { WordleGame } from "./wordle/WordleGame";

export function Wordle() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="wordle-shell">
      <header className="wordle-shell-header">
        <h2 className="wordle-shell-title">Wordle</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>

      <div className="wordle-player-badge">
        <span className="wordle-player-label">Playing as</span>
        <span className="wordle-player-name">{playerName}</span>
      </div>

      <WordleGame />
    </div>
  );
}
