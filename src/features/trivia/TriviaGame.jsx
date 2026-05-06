import React from "react";
import { TriviaControls } from "./components/TriviaControls";
import { TriviaQuestion } from "./components/TriviaQuestion";
import { TriviaSummary } from "./components/TriviaSummary";
import { useTriviaGame } from "./logic/useTriviaGame";
import "../../styles/Trivia.css";

export function TriviaGame() {
  const {
    categories,
    currentQuestion,
    error,
    gameState,
    nextQuestion,
    questions,
    restartGame,
    settings,
    startGame,
    status,
    submitAnswer,
    updateSettings,
  } = useTriviaGame();

  return (
    <section className="trivia-page">
      <TriviaControls
        categories={categories}
        onStartGame={startGame}
        onSettingsChange={updateSettings}
        settings={settings}
        status={status}
      />

      {error ? (
        <div className="trivia-banner trivia-banner-error">{error}</div>
      ) : null}

      <div className="trivia-layout">
        <TriviaQuestion
          currentQuestion={currentQuestion}
          gameState={gameState}
          onAnswer={submitAnswer}
        />

        <TriviaSummary
          currentQuestion={currentQuestion}
          gameState={gameState}
          onNextQuestion={nextQuestion}
          onRestart={restartGame}
          questionCount={questions.length}
        />
      </div>
    </section>
  );
}

export default TriviaGame;
