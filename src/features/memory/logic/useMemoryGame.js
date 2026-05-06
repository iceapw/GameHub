import { useEffect, useReducer, useState } from "react";

const GLYPHS = [
  { symbol: "◆", color: "#818cf8", glow: "rgba(129,140,248,0.85)" },
  { symbol: "★", color: "#c084fc", glow: "rgba(192,132,252,0.85)" },
  { symbol: "●", color: "#f472b6", glow: "rgba(244,114,182,0.85)" },
  { symbol: "▲", color: "#34d399", glow: "rgba(52,211,153,0.85)"  },
  { symbol: "■", color: "#fbbf24", glow: "rgba(251,191,36,0.85)"  },
  { symbol: "⊕", color: "#60a5fa", glow: "rgba(96,165,250,0.85)"  },
  { symbol: "♦", color: "#f87171", glow: "rgba(248,113,113,0.85)" },
  { symbol: "♠", color: "#a3e635", glow: "rgba(163,230,53,0.85)"  },
  { symbol: "♥", color: "#fb923c", glow: "rgba(251,146,60,0.85)"  },
  { symbol: "♣", color: "#e879f9", glow: "rgba(232,121,249,0.85)" },
];

export const DIFFICULTY_CONFIG = {
  easy:   { pairs: 6,  cols: 4, rows: 3, flipDelay: 1400, label: "Easy"   },
  normal: { pairs: 8,  cols: 4, rows: 4, flipDelay: 1000, label: "Normal" },
  hard:   { pairs: 10, cols: 5, rows: 4, flipDelay: 600,  label: "Hard"   },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createDeck(pairs) {
  const glyphs = GLYPHS.slice(0, pairs);
  return shuffle([...glyphs, ...glyphs]).map((g, i) => ({
    id: i,
    symbol: g.symbol,
    color: g.color,
    glow: g.glow,
    isFlipped: false,
    isMatched: false,
  }));
}

function makeInitialState(pairs) {
  return {
    cards: createDeck(pairs),
    firstFlipped: null,
    locked: false,
    pendingReset: null,
    moves: 0,
    status: "playing",
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "FLIP": {
      const { idx } = action;
      const card = state.cards[idx];
      if (state.locked || card.isFlipped || card.isMatched) return state;

      const nextCards = state.cards.map((c, i) =>
        i === idx ? { ...c, isFlipped: true } : c,
      );

      if (state.firstFlipped === null) {
        return { ...state, cards: nextCards, firstFlipped: idx };
      }

      const isMatch = nextCards[state.firstFlipped].symbol === nextCards[idx].symbol;
      const moves = state.moves + 1;

      if (isMatch) {
        const fi = state.firstFlipped;
        const matched = nextCards.map((c, i) =>
          i === fi || i === idx ? { ...c, isMatched: true } : c,
        );
        return {
          ...state,
          cards: matched,
          firstFlipped: null,
          moves,
          status: matched.every((c) => c.isMatched) ? "won" : "playing",
        };
      }

      return {
        ...state,
        cards: nextCards,
        firstFlipped: null,
        moves,
        locked: true,
        pendingReset: [state.firstFlipped, idx],
      };
    }

    case "RESOLVE_MISMATCH": {
      const [i, j] = state.pendingReset;
      return {
        ...state,
        cards: state.cards.map((c, k) =>
          k === i || k === j ? { ...c, isFlipped: false } : c,
        ),
        locked: false,
        pendingReset: null,
      };
    }

    case "NEW_GAME":
      return makeInitialState(action.pairs);

    default:
      return state;
  }
}

export function useMemoryGame(initialDifficulty = "normal") {
  const difficulty = initialDifficulty;
  const [game, dispatch] = useReducer(
    reducer,
    DIFFICULTY_CONFIG[initialDifficulty].pairs,
    makeInitialState,
  );
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (game.status !== "playing") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [game.status]);

  useEffect(() => {
    if (!game.pendingReset) return;
    const t = setTimeout(
      () => dispatch({ type: "RESOLVE_MISMATCH" }),
      DIFFICULTY_CONFIG[difficulty].flipDelay,
    );
    return () => clearTimeout(t);
  }, [game.pendingReset, difficulty]);

  const newGame = () => {
    setElapsed(0);
    dispatch({ type: "NEW_GAME", pairs: DIFFICULTY_CONFIG[difficulty].pairs });
  };

  return {
    ...game,
    elapsed,
    difficulty,
    config: DIFFICULTY_CONFIG[difficulty],
    flipCard: (idx) => dispatch({ type: "FLIP", idx }),
    newGame,
  };
}
