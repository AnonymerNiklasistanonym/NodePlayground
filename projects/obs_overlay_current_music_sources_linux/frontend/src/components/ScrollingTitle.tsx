import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollingTitleProps {
  children: ReactNode;
}

export default function ScrollingTitle({ children }: ScrollingTitleProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;

    if (container && text) {
      setOverflowing(text.scrollWidth > container.clientWidth);
    }
  }, [children]);

  return (
    <div ref={containerRef} className={`title-container ${overflowing ? "scrolling" : ""}`}>
      <div ref={textRef} className="title">
        {children}
      </div>
    </div>
  );
}
