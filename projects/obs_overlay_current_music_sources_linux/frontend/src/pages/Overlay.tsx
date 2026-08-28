import Player from "../components/Player";
import type { MediaSource } from "../helper/types";
import "./Overlay.css";
import { useEffect, useMemo, useState } from "react";

export interface OverlayProps {
  edit?: boolean;
}

const raw = false as const;

const UPDATE_INTERVAL = 5000 as const;

const PRIORITY_PROVIDER = ["org.mpris.MediaPlayer2.plasma-browser-integration"];

function Overlay({ edit: _edit }: OverlayProps) {
  const [players, setPlayers] = useState<MediaSource[]>([]);
  const [error, setError] = useState<Error | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/current_music_sources_linux");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      setPlayers(data);
      setError(null);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err);
      }
    }
  }

  useEffect(() => {
    refresh();

    const timer = setInterval(refresh, UPDATE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const activePlayers = useMemo(() => {
    const playing = players.filter((player) => player.status === "Playing");
    if (playing.length > 1) {
      const onlyPriorityPlayers = playing.filter((player) =>
        PRIORITY_PROVIDER.includes(player.bus_name),
      );
      if (onlyPriorityPlayers.length > 0) {
        return onlyPriorityPlayers;
      }
    }
    return playing;
    // TODO Filter for specific sources
  }, [players]);

  return (
    <main>
      {error && <div className="error">{error.message}</div>}

      <section>
        {activePlayers.length > 0 &&
          activePlayers.map((player) => <Player key={player.bus_name} player={player} />)}
      </section>

      {raw && (
        <details>
          <summary>Raw MPRIS data</summary>
          <pre>{JSON.stringify(players, null, 2)}</pre>
        </details>
      )}
    </main>
  );
}

export default Overlay;
