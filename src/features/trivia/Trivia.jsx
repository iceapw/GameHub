import { useNavigate } from "react-router-dom";
import { TriviaGame } from "./trivia/TriviaGame";

export function Trivia() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="trivia-shell">
      <header className="trivia-shell-header">
        <h2 className="trivia-shell-title">Trivia</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>

      <div className="trivia-player-badge">
        <span className="trivia-player-label">Playing as</span>
        <span className="trivia-player-name">{playerName}</span>
      </div>

      <TriviaGame />
    </div>
  );
}

export default Trivia;
