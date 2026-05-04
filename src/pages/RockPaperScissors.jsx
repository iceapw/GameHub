import { GameSection } from "./rock-paper-scissors/components/GameSection";
import { HighScoresSection } from "./rock-paper-scissors/components/HighScoresSection";
import { PlayerInfoCard } from "./rock-paper-scissors/components/PlayerInfoCard";
import "../styles/RPS.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

function decideWinner(player, cpu) {
  if (player === cpu) return "tie";
  return beats[player] === cpu ? "player" : "cpu";
}

function getCpuMove({
  difficulty = "normal",
  lastPlayerMove = null,
} = {}) {
  const moves = ["rock", "paper", "scissors"];
  if (difficulty !== "hard" || !lastPlayerMove) {
    return moves[Math.floor(Math.random() * 3)];
  }
  const counter = { rock: "paper", paper: "scissors", scissors: "rock" }[
    lastPlayerMove
  ];
  return Math.random() < 0.6 ? counter : moves[Math.floor(Math.random() * 3)];
}

function nextScore(prev, outcome) {
  const s = { ...prev };
  if (outcome === "player") s.player++;
  else if (outcome === "cpu") s.cpu++;
  else s.ties++;
  return s;
}

export function RPSGamePage() {
  const settings = JSON.parse(localStorage.getItem("rpsSettings")) || {};
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";
  const playerAvatar = sessionStorage.getItem("playerAvatar") || "assassin";
  const difficulty = settings?.difficulty || "normal";

  const [highScore, setHighScore] = useState(
    () => JSON.parse(localStorage.getItem("rpsHighScore")) || null,
  );

  const handleGameReset = (finalScore) => {
    if (finalScore.player === 0) return;

    if (highScore && finalScore.player <= highScore.score) return;

    const newEntry = {
      name: playerName,
      score: finalScore.player,
      date: new Date().toISOString(),
    };

    setHighScore(newEntry);
    localStorage.setItem("rpsHighScore", JSON.stringify(newEntry));
  };

  const handleClearHighScore = () => {
    localStorage.removeItem("rpsHighScore");
    setHighScore(null);
  };

  return (
    <main className="rps-main">
      <header>
        <h2>Rock Paper Scissors</h2>
        <nav>
          <a onClick={() => navigate("/")} className="nav-link">
            ← Back to Lobby
          </a>
        </nav>
      </header>
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />
      <GameSection
        difficulty={difficulty}
        onGameReset={handleGameReset}
        beats={beats}
        decideWinner={decideWinner}
        getCpuMove={getCpuMove}
        nextScore={nextScore}
      />
      <HighScoresSection highScore={highScore} onClear={handleClearHighScore} />
    </main>
  );
}
