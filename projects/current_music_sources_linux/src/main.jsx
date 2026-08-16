import React, { useEffect, useMemo, useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

function formatTime(us) {
  const seconds = Math.floor((us || 0) / 1_000_000);
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function ScrollingTitle({ children }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      setOverflowing(text.scrollWidth > container.clientWidth);
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`title-container ${overflowing ? "scrolling" : ""}`}
    >
      <div ref={textRef} className="title">
        {children}
      </div>
    </div>
  );
}

function Player({ player }) {
  const track = player.track || {};
  const position = player.position || {};

  const progress =
    position.length_us > 0
      ? Math.min(100, (position.current_us / position.length_us) * 100)
      : 0;

  const artist =
    track.artists?.length > 0
      ? track.artists.join(", ")
      : player.identity;

  return (
    <article className="player">
      <div className="art">
        {track.art_url ? (
          <img src={track.art_url} alt=""    />
        ) : (
          <div className="art-placeholder">♫</div>
        )}
      </div>

      <div className="info">
        <div className="status">
          <span
            className={`dot ${
              player.status.toLowerCase() === "playing"
                ? "playing"
                : ""
            }`}
          />
          {player.status}
          <span className="source">{player.identity}</span>
        </div>

        <ScrollingTitle><h2>{track.title || "Unknown track"}</h2></ScrollingTitle>
        <ScrollingTitle><p>{artist}</p></ScrollingTitle>

        <div className="progress">
          <div
            className="progress-value"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="times">
          <span>{formatTime(position.current_us)}</span>
          <span>{formatTime(position.length_us)}</span>
        </div>
      </div>
    </article>
  );
}

const raw = false;

function App() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);

  async function refresh() {
    try {
      const response = await fetch("/api/media");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setPlayers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();

    const timer = setInterval(refresh, 1000);

    return () => clearInterval(timer);
  }, []);

  const activePlayers = useMemo(() => {
    const playing = players.filter(player => player.status === "Playing")
    console.log("playing", playing, playing.length)
    if (playing.length === 1) {
        return playing
    }
    const playingAndPosition = playing.filter(a => a.position.current_us != null && a.position.length_us != null)
    console.log("playingAndPosition", playingAndPosition, playingAndPosition.length)
    if (playingAndPosition.length === 1) {
        return playingAndPosition
    }
    // Otherwise render all of them
    if (playingAndPosition.length > 0) {
        return playingAndPosition
    }
    return playing
  }, [players]);

  return (
    <main>
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <section>
        {activePlayers.length > 0 && (
          activePlayers.map(player => (
            <Player
              key={player.bus_name}
              player={player}
            />
          ))
        )}
      </section>

      {raw && <details>
        <summary>Raw MPRIS data</summary>
        <pre>{JSON.stringify(players, null, 2)}</pre>
      </details>}
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
