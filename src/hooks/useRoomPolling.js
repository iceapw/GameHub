import { useEffect, useRef } from "react";
import { getRoom } from "../utils/gameRoomApi";

export function useRoomPolling({ roomId, enabled, onUpdate, onAbandoned }) {
  const currentPokemonIdRef = useRef(null);
  const onUpdateRef = useRef(onUpdate);
  const onAbandonedRef = useRef(onAbandoned);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onAbandonedRef.current = onAbandoned;
  }, [onUpdate, onAbandoned]);

  useEffect(() => {
    if (!enabled || !roomId) return;

    const interval = setInterval(async () => {
      try {
        const { gameState } = await getRoom(roomId);

        if (gameState.phase === "abandoned") {
          clearInterval(interval);
          onAbandonedRef.current?.();
          return;
        }

        onUpdateRef.current?.(gameState);

        if (
          gameState.pokemon &&
          gameState.pokemon.id !== currentPokemonIdRef.current
        ) {
          currentPokemonIdRef.current = gameState.pokemon.id;
          console.log(
            `🎮 Pokemon: ${gameState.pokemon.name} (ID: ${gameState.pokemon.id})`,
          );
        }
      } catch (error) {
        console.error("Room polling failed", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, enabled]);
}
