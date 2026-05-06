import React from "react";

export function TriviaSummary({
  currentQuestion,
  gameState,
  onNextQuestion,
  onRestart,
  questionCount,
}) {
  const isLastQuestion = gameState.currentIndex >= questionCount - 1;
  const hasAnswered = Boolean(gameState.selectedAnswer);
  const isCorrect = hasAnswered && currentQuestion && gameState.selectedAnswer === currentQuestion.correctAnswer;

  let summaryLabel = null;
  let summaryClass = "trivia-summary-label";
  if (gameState.finished) {
    summaryLabel = "Trivia complete";
  } else if (hasAnswered) {
    summaryLabel = isCorrect ? "Correct" : "Incorrect";
    summaryClass += isCorrect ? " trivia-summary-correct" : " trivia-summary-incorrect";
  }

  return (
    <section className="trivia-card trivia-summary-card">
      <div className="trivia-score-stack">
        <div className="trivia-score-box">
          <span className="trivia-score-value">
            {Math.min(gameState.currentIndex + 1, questionCount)} /{" "}
            {questionCount}
          </span>
          <span className="trivia-score-label">Question</span>
        </div>

        <div className="trivia-score-box">
          <span className="trivia-score-value">
            {gameState.correctCount} / {questionCount}
          </span>
          <span className="trivia-score-label">Score</span>
        </div>
      </div>

      {summaryLabel && <p className={summaryClass}>{summaryLabel}</p>}

      <div className="trivia-summary-actions">
        {gameState.finished ? (
          <button
            className="trivia-secondary-button"
            onClick={onRestart}
            type="button"
          >
            Play Again
          </button>
        ) : (
          <button
            className="trivia-secondary-button"
            disabled={!gameState.selectedAnswer}
            onClick={onNextQuestion}
            type="button"
          >
            {isLastQuestion ? "Finish Game" : "Next Question"}
          </button>
        )}
      </div>
    </section>
  );
}
