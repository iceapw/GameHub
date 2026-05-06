import React from "react";

export function GameRoomHeader({ title, onBackToLobby, backLabel = "← Back to Lobby" }) {
  return (
    <header className="pg-header">
      <h2 className="pg-heading">{title}</h2>
      <nav>
        <a onClick={onBackToLobby} className="nav-link">
          {backLabel}
        </a>
      </nav>
    </header>
  );
}
