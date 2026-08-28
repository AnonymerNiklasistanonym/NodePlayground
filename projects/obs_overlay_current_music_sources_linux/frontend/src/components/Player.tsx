import { useEffect, useMemo, useState } from "react";
import { formatTime } from "../helper/formatTime";
import type { MediaSource } from "../helper/types";
import ScrollingTitle from "./ScrollingTitle";

interface PlayerProps {
  player: MediaSource;
}

export default function Player({ player }: PlayerProps) {
  const track = player.track;
  const position = player.position;
  const [positionCurrent, setPositionCurrent] = useState(position?.current_us);

  const progress = useMemo(() => {
    if (position && position.length_us && position.length_us > 0 && positionCurrent) {
      return Math.min(100, (positionCurrent / position.length_us) * 100);
    }
    return null;
  }, [position, positionCurrent]);

  const artist = useMemo(() => {
    if (track && track.artists && track.artists.length > 0) {
      return track?.artists.join(", ");
    }
    return null;
  }, [position]);

  useEffect(() => {
    setPositionCurrent(position?.current_us);
  }, [position]);

  useEffect(() => {
    let lastTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsedUs = (now - lastTime) * 1000;
      const currentMaxTime = position?.length_us;

      lastTime = now;

      if (currentMaxTime && currentMaxTime > 0) {
        setPositionCurrent((current) =>
          current ? Math.min(current + elapsedUs, currentMaxTime) : current,
        );
      }
    }, 100);

    return () => clearInterval(interval);
  }, [position?.length_us]);

  return (
    <article className="player">
      <div className="art">
        {track?.art_url ? (
          <img src={track.art_url} alt="" />
        ) : (
          <div className="art-placeholder">♫</div>
        )}
      </div>

      <div className="info">
        {player && (
          <div className="status">
            <span
              className={`dot ${player.status?.toLowerCase() === "playing" ? "playing" : ""}`}
            />
            {player.status}
            <span className="source">{player.identity}</span>
          </div>
        )}

        <ScrollingTitle>
          <h2>{track?.title || "Unknown track"}</h2>
        </ScrollingTitle>
        {artist && (
          <ScrollingTitle>
            <p>{artist}</p>
          </ScrollingTitle>
        )}

        {progress && (
          <div className="progress">
            <div className="progress-value" style={{ width: `${progress}%` }} />
          </div>
        )}

        {position && position.current_us && position.length_us && positionCurrent && (
          <div className="times">
            <span>{formatTime(positionCurrent)}</span>
            <span>{formatTime(position.length_us)}</span>
          </div>
        )}
      </div>
    </article>
  );
}
