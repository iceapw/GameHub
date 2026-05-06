import React, { useEffect, useRef } from "react";
import "animate.css";
import { WordleBoard } from "./components/WordleBoard";
import { useWordleGame } from "./logic/useWordleGame";
import "../../styles/Wordle.css";

function normalizeKeyboardInput(rawKey) {
  if (!rawKey) return null;
  if (rawKey === "Enter") return "ENTER";
  if (rawKey === "Backspace" || rawKey === "Delete") return "BACKSPACE";
  if (/^[a-zA-Z]$/.test(rawKey)) return rawKey.toUpperCase();
  return null;
}

export function WordleGame() {
  const hasLoadedOnce = useRef(false);

  const {
    answer,
    currentGuess,
    currentRow,
    evaluations,
    gameResult,
    guesses,
    handleKeyInput,
    invalidAttemptCount,
    maxGuesses,
    revealCounts,
    startNewGame,
    status,
    wordLength,
  } = useWordleGame();

  useEffect(() => {
    if (status === "playing") hasLoadedOnce.current = true;
  }, [status]);

  useEffect(() => {
    function onKeyDown(event) {
      const normalizedKey = normalizeKeyboardInput(event.key);
      if (!normalizedKey) return;
      event.preventDefault();
      handleKeyInput(normalizedKey);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKeyInput]);

  return (
    <section className="wordle-page">
      <WordleBoard
        currentGuess={currentGuess}
        currentRow={currentRow}
        evaluations={evaluations}
        guesses={guesses}
        invalidAttemptCount={invalidAttemptCount}
        maxGuesses={maxGuesses}
        revealCounts={revealCounts}
        status={status}
        wordLength={wordLength}
      />

      <div className="wordle-actions">
        {status === "loading" && hasLoadedOnce.current && <p className="wordle-answer">Loading word...</p>}
        {(status === "won" || status === "lost") && (
          <p className="wordle-answer">Answer: {answer} — {gameResult}</p>
        )}
        <button className="wordle-new-game" onClick={startNewGame} type="button">
          New Game
        </button>
      </div>
    </section>
  );
}
