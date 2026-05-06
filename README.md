# GameHub

Six browser games in one place, built with React. Two of them support real-time online multiplayer with shareable room codes, no account needed.

**[Play now](https://your-app.vercel.app)**

---

## Games

| Game | Description |
|------|-------------|
| Rock Paper Scissors | Play against an AI with adjustable difficulty, tracks your win/loss history and high score |
| Wordle | Guess the 5-letter word in 6 tries, each guess is validated against a real dictionary |
| Tic Tac Toe | Online 1v1, share a room code with a friend and play in real time |
| Symbol Match | Flip cards to find matching pairs, available in 3 difficulty levels |
| Trivia | Multiple categories and difficulties, questions pulled from Open Trivia DB |
| Pokemon | Reveal tiles to uncover a hidden Pokemon and guess before your opponent does |

### Multiplayer

Tic Tac Toe and Pokemon both support online 1v1. One player creates a room and sends the code, the other joins instantly. No signup required.

---

## Tech stack

- **React 19** + **Vite 7**
- **React Router v6**
- **CSS** with per-feature stylesheets

## External APIs

| API | Used by |
|-----|---------|
| [PokeAPI](https://pokeapi.co/api/v2/pokemon) | Pokemon |
| [Open Trivia Database](https://opentdb.com) | Trivia |
| [Random Word API](https://random-word-api.vercel.app) | Wordle |
| [DictionaryAPI](https://dictionaryapi.dev) | Wordle |
