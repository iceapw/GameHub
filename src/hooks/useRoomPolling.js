import { useEffect, useRef } from "react";
import { getRoom } from "../utils/gameRoomApi";

export function useRoomPolling({ roomId, enabled, onUpdate, onAbandoned }) {
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
      } catch {
        // silently retry on network errors
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, enabled]);
}
