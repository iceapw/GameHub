import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LobbyScreen } from "./components/LobbyScreen";
import { WaitingRoom } from "./components/WaitingRoom";
import { ScoreBar } from "../../components/game-room/ScoreBar";
import { TileBoard } from "./components/TileBoard";
import { ActionPanel } from "./components/ActionPanel";
import { RoundResult } from "./components/RoundResult";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import { useRoomPolling } from "../../hooks/useRoomPolling";
import { useGameActions } from "./logic/useGameActions";
import { createGameState, fetchRandomPokemon, playerLeft } from "./logic/pokemonGame";
import { getPlayerId, abandonRoom, updateRoom, getRoom } from "../../utils/gameRoomApi";
import "../../styles/PokemonGame.css";

export default function Pokemon() {
  const navigate = useNavigate();
  const playerId = getPlayerId();

  const [screen, setScreen] = useState("lobby");
  const [mode, setMode] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [game, setGame] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [loadingPokemon, setLoadingPokemon] = useState(false);
  const [guess, setGuess] = useState("");
  const [actionMode, setActionMode] = useState(null);

  const resetToLobby = () => {
    setScreen("lobby");
    setGame(null);
    setPokemon(null);
    setRoomId(null);
    setMode(null);
    setActionMode(null);
    setGuess("");
  };

  useRoomPolling({
    roomId,
    enabled: mode === "online" && screen === "game",
    onUpdate: (gameState) => {
      setGame(gameState);
      if (gameState.pokemon) setPokemon(gameState.pokemon);
    },
    onAbandoned: () => {
      alert("The game has ended — not enough players remaining.");
      resetToLobby();
    },
  });

  const handleOnlineBack = async () => {
    if (mode === "online" && roomId && game && game.phase !== "gameOver" && game.phase !== "abandoned") {
      try {
        const { gameState: latest } = await getRoom(roomId);
        const remaining = latest.players.filter((p) => p.id !== playerId);
        if (remaining.length === 0) {
          await abandonRoom(roomId, latest);
        } else if (latest.phase === "waiting") {
          await updateRoom(roomId, {
            ...latest,
            players: remaining,
            version: (latest.version ?? 0) + 1,
          });
        } else {
          const activeOthers = latest.players.filter(
            (p) => !p.left && p.id !== playerId,
          ).length;
          if (activeOthers <= 1) {
            await abandonRoom(roomId, latest);
          } else {
            const next = playerLeft(latest, playerId);
            await updateRoom(roomId, {
              ...next,
              version: (latest.version ?? 0) + 1,
            });
          }
        }
      } catch {
        // ignore — already navigating away
      }
    }
    resetToLobby();
  };

  const { handleReveal, handleGuessSubmit, handleNextRound } = useGameActions({
    game,
    pokemon,
    mode,
    roomId,
    setGame,
    setPokemon,
    setLoadingPokemon,
    setActionMode,
    setGuess,
  });

  const handleJoinRoom = (rId, gameState) => {
    setRoomId(rId);
    setGame(gameState);
    if (gameState.pokemon) setPokemon(gameState.pokemon);
    setMode("online");
    setScreen("waiting");
  };

  const handleLocalPlay = async () => {
    setMode("local");
    const p = await fetchRandomPokemon();
    setPokemon(p);
    setGame(
      createGameState(["Player 1", "Player 2"], {
        tileCount: 25,
        maxPlayers: 2,
      }),
    );
    setScreen("game");
  };

  const handleGameStart = (gameState) => {
    setGame(gameState);
    if (gameState.pokemon) setPokemon(gameState.pokemon);
    setScreen("game");
  };

  const isMyTurn =
    mode === "local"
      ? true
      : game?.players[game.currentPlayerIndex]?.id === playerId;
  const currentPlayer = game?.players[game?.currentPlayerIndex];
  const allTilesRevealed = game?.tiles.every(Boolean);
  const isRoundOver = game?.phase === "roundOver" || game?.phase === "gameOver";

  if (screen === "lobby") {
    return (
      <div className="pg-wrapper">
        <GameRoomHeader title="Who's That Pokémon?" onBackToLobby={() => navigate("/")} />
        <LobbyScreen
          onJoinRoom={handleJoinRoom}
          onLocalPlay={handleLocalPlay}
        />
      </div>
    );
  }

  if (screen === "waiting") {
    return (
      <div className="pg-wrapper">
        <GameRoomHeader title="Who's That Pokémon?" onBackToLobby={handleOnlineBack} />
        <WaitingRoom
          roomId={roomId}
          onGameStart={handleGameStart}
          onBackToLobby={resetToLobby}
        />
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="pg-wrapper">
      <GameRoomHeader title="Who's That Pokémon?" onBackToLobby={handleOnlineBack} />

      {mode === "online" && roomId && (
        <div className="pg-room-badge">
          Room: <span>{roomId}</span>
        </div>
      )}

      <ScoreBar game={game} isRoundOver={isRoundOver} />

      <div className="pg-board">
        <TileBoard
          pokemon={pokemon}
          tiles={game.tiles}
          tileCount={game.tileCount}
          isRoundOver={isRoundOver}
          actionMode={actionMode}
          isMyTurn={isMyTurn}
          loadingPokemon={loadingPokemon}
          onReveal={(i) => handleReveal(i, { playerId, actionMode })}
        />

        {!isRoundOver ? (
          <ActionPanel
            currentPlayer={currentPlayer}
            isMyTurn={isMyTurn}
            allTilesRevealed={allTilesRevealed}
            actionMode={actionMode}
            setActionMode={setActionMode}
            guess={guess}
            setGuess={setGuess}
            onGuessSubmit={() => handleGuessSubmit(guess)}
            game={game}
          />
        ) : (
          <RoundResult
            game={game}
            pokemon={pokemon}
            isMyTurn={isMyTurn}
            mode={mode}
            onNextRound={handleNextRound}
            onBackToLobby={resetToLobby}
          />
        )}
      </div>
    </div>
  );
}
