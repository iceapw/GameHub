import { PokemonPreview } from "./pages/previews/PokemonPreview";
import { RpsPreview } from "./pages/previews/RpsPreview";
import { TicTacToePreview } from "./pages/previews/TicTacToePreview";
import { TriviaPreview } from "./pages/previews/TriviaPreview";
import { WordlePreview } from "./pages/previews/WordlePreview";
import { MemoryPreview } from "./pages/previews/MemoryPreview";

export const games = [
  {
    key: "rps",
    path: "/rps",
    name: "Rock Paper Scissors",
    description: "Challenge the machine. Choose wisely.",
    emoji: "✊",
    color: "#f472b6",
    Preview: RpsPreview,
  },
  {
    key: "wordle",
    path: "/wordle",
    name: "Wordle",
    description: "Guess the word. Six chances only.",
    emoji: "📝",
    color: "#fbbf24",
    Preview: WordlePreview,
  },
  {
    key: "tic-tac-toe",
    path: "/tic-tac-toe",
    name: "Tic Tac Toe",
    description: "Three in a row. Classic never dies.",
    emoji: "⬛",
    color: "#818cf8",
    Preview: TicTacToePreview,
  },
  {
    key: "memory",
    path: "/memory",
    name: "Symbol Match",
    description: "Flip the cards. Find the pairs.",
    emoji: "✦",
    color: "#60a5fa",
    Preview: MemoryPreview,
  },
  {
    key: "trivia",
    path: "/trivia",
    name: "Trivia",
    description: "Test your knowledge. Beat the clock.",
    emoji: "🧠",
    color: "#34d399",
    Preview: TriviaPreview,
  },
  {
    key: "pokemon",
    path: "/pokemon",
    name: "Pokemon",
    description: "Reveal the image. Guess what's hiding.",
    emoji: "🖼️",
    color: "#c084fc",
    Preview: PokemonPreview,
  },
];
