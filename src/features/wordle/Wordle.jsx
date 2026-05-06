import { useNavigate } from "react-router-dom";
import { WordleGame } from "./WordleGame";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import { RoomPlayerBadge } from "../../components/game-room/RoomPlayerBadge";
import "../../styles/PokemonGame.css";

export function Wordle() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="pg-wrapper">
      <GameRoomHeader title="Wordle" onBackToLobby={() => navigate("/")} />
      <RoomPlayerBadge name={playerName} />
      <WordleGame />
    </div>
  );
}
