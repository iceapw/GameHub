# GameHub

A browser-based multi-game platform built with React. Six playable games behind a single lobby, shared player identity, and a consistent visual system. Two games feature real-time online multiplayer via shareable room codes.

**[Play now →](https://your-app.vercel.app)**

---

## Games

| Game | Mode | Description |
|------|------|-------------|
| Rock Paper Scissors | Single-player | Adjustable AI difficulty with win/loss history and high score tracking |
| Wordle | Single-player | Guess the 5-letter word in 6 tries with live dictionary validation |
| Tic Tac Toe | Online multiplayer | Real-time 1v1 via shareable room codes |
| Symbol Match | Single-player | Card-flip memory game across 3 difficulty levels |
| Trivia | Single-player | Multiple categories and difficulties powered by Open Trivia DB |
| Pokemon | Online multiplayer | Reveal tiles to uncover a hidden Pokémon — guess before your opponent does |

### Multiplayer

Tic Tac Toe and Pokemon support real-time 1v1 play. One player creates a room and shares the code; the other joins instantly — no account needed. Game state is version-stamped and synced every second without WebSockets.

---

## Tech stack

- **React 19** + **Vite 7**
- **React Router v6** 
- **CSS** 

## External APIs

| API | Used by |
|-----|---------|
| [PokeAPI](https://pokeapi.co/api/v2/pokemon) | Pokemon |
| [Open Trivia Database](https://opentdb.com) | Trivia |
| [Random Word API](https://random-word-api.vercel.app) | Wordle — answer selection |
| [DictionaryAPI](https://dictionaryapi.dev) | Wordle — guess validation |
