import { HistorySection } from "./HistorySection";
import { MoveButton } from "./MoveButton";
import { ScoreBoard } from "./ScoreBoard";
import { useState } from "react";

const DIFFICULTIES = ["easy", "normal", "hard"];

const DIFFICULTY_LABEL = { easy: "Easy", normal: "Normal", hard: "Hard" };

export const GameSection = ({
  onGameReset,
  beats,
  decideWinner,
  getCpuMove,
  nextScore,
}) => {
  const [difficulty, setDifficulty] = useState(
    () => localStorage.getItem("rpsDifficulty") || "normal",
  );
  const [score, setScore] = useState({ player: 0, cpu: 0, ties: 0 });
  const [history, setHistory] = useState([]);
  const [lastPlayerMove, setLastPlayerMove] = useState(null);
  const moves = Object.keys(beats);

  const resetGame = (currentScore) => {
    onGameReset?.(currentScore);
    setScore({ player: 0, cpu: 0, ties: 0 });
    setHistory([]);
    setLastPlayerMove(null);
  };

  const handleDifficulty = (d) => {
    setDifficulty(d);
    localStorage.setItem("rpsDifficulty", d);
    resetGame(score);
  };

  const playRound = (move) => {
    const cpuMove = getCpuMove({ difficulty, lastPlayerMove });
    const outcome = decideWinner(move, cpuMove);
    const msg =
      outcome === "player"
        ? "You win!"
        : outcome === "cpu"
          ? "CPU wins!"
          : "Tie.";
    setScore((s) => nextScore(s, outcome));
    setHistory((h) => [{ player: move, cpu: cpuMove, msg }, ...h]);
    setLastPlayerMove(move);
  };

  return (
    <section aria-labelledby="game-heading" className="card">
      <div className="game-section-header">
        <h2 id="game-heading">Game</h2>
        <div className="difficulty-picker">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              className={`difficulty-btn${difficulty === d ? ` active-${d}` : ""}`}
              onClick={() => handleDifficulty(d)}
            >
              {DIFFICULTY_LABEL[d]}
            </button>
          ))}
        </div>
      </div>
      <ScoreBoard score={score} />
      <div className="buttons">
        {moves.map((m) => (
          <MoveButton key={m} label={m} onClick={() => playRound(m)} />
        ))}
      </div>
      <HistorySection history={history} />
      <div className="buttons">
        <button id="reset-game" type="button" onClick={() => resetGame(score)}>
          Reset Game
        </button>
      </div>
    </section>
  );
};
