import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { RPSGamePage } from "./features/rock-paper-scissors/RockPaperScissors";
import { TicTacToe } from "./features/tic-tac-toe/TicTacToe";
import { Trivia } from "./features/trivia/Trivia";
import { Wordle } from "./features/wordle/Wordle";
import Pokemon from "./features/pokemon/Pokemon";
import { Memory } from "./features/memory/Memory";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/rps", element: <RPSGamePage /> },
        { path: "/tic-tac-toe", element: <TicTacToe /> },
        { path: "/trivia", element: <Trivia /> },
        { path: "/wordle", element: <Wordle /> },
        { path: "/pokemon", element: <Pokemon /> },
        { path: "/memory", element: <Memory /> },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
