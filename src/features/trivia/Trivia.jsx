import { useNavigate } from "react-router-dom";
import { TriviaGame } from "./TriviaGame";
import { GameRoomHeader } from "../../components/game-room/GameRoomHeader";
import { RoomPlayerBadge } from "../../components/game-room/RoomPlayerBadge";
import "../../styles/PokemonGame.css";

export function Trivia() {
  const navigate = useNavigate();
  const playerName = sessionStorage.getItem("playerName") || "Player";

  return (
    <div className="pg-wrapper">
      <GameRoomHeader title="Trivia" onBackToLobby={() => navigate("/")} />
      <RoomPlayerBadge name={playerName} />
      <TriviaGame />
    </div>
  );
}

export default Trivia;
