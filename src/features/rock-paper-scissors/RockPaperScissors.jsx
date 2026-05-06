import { GameSection } from "./components/GameSection";
import { HighScoresSection } from "./components/HighScoresSection";
import { PlayerInfoCard } from "./components/PlayerInfoCard";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import "../../styles/PokemonGame.css";
import "../../styles/RPS.css";
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

function getCpuMove({ difficulty = "normal", lastPlayerMove = null } = {}) {
  const moves = ["rock", "paper", "scissors"];
  const rand = () => moves[Math.floor(Math.random() * 3)];

  if (lastPlayerMove) {
    if (difficulty === "easy") {
      // 50% chance CPU plays the losing move (lets player win)
      const loses = { rock: "scissors", paper: "rock", scissors: "paper" };
      return Math.random() < 0.5 ? loses[lastPlayerMove] : rand();
    }
    if (difficulty === "hard") {
      // 65% chance CPU counters player's last move
      const counter = { rock: "paper", paper: "scissors", scissors: "rock" };
      return Math.random() < 0.65 ? counter[lastPlayerMove] : rand();
    }
  }
  return rand();
}

function nextScore(prev, outcome) {
  const s = { ...prev };
  if (outcome === "player") s.player++;
  else if (outcome === "cpu") s.cpu++;
  else s.ties++;
  return s;
}

export function RPSGamePage() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";
  const playerAvatar = sessionStorage.getItem("playerAvatar") || "assassin";

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
    <div className="rps-main">
      <GameRoomHeader title="Rock Paper Scissors" onBackToLobby={() => navigate("/")} />
      <PlayerInfoCard playerName={playerName} playerAvatar={playerAvatar} />
      <GameSection
        onGameReset={handleGameReset}
        beats={beats}
        decideWinner={decideWinner}
        getCpuMove={getCpuMove}
        nextScore={nextScore}
      />
      <HighScoresSection highScore={highScore} onClear={handleClearHighScore} />
    </div>
  );
}
