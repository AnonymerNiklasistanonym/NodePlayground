import { useEffect, useRef, useState } from "react";

interface WhyDidYouUpdateOptions {
  color?: string;
}

interface ChangesTable {
  prop: string;
  equal: string;
  from: unknown;
  to: unknown;
}

function possiblyEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default function useWhyDidYouUpdate(
  name: string,
  props: Record<string, unknown>,
  options?: WhyDidYouUpdateOptions // = { color: "#3b82f6" },
) {
  const previous = useRef(props);
  const isFirstRender = useRef(true);
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const changes: Record<string, ChangesTable> = {};

    const allKeys = new Set([...Object.keys(previous.current), ...Object.keys(props)]);

    for (const key of allKeys) {
      if (!Object.is(previous.current[key], props[key])) {
        changes[key] = {
          prop: key,
          equal: possiblyEqual(previous.current[key], props[key]) ? '⚠️' : '❔',
          from: previous.current[key],
          to: props[key],
        };
      }
    }

    const numberOfChanges = Object.keys(changes).length;

    console.groupCollapsed(
      `%c🔄 ${name} (changes: ${numberOfChanges} / render: #${renderCount.current})`,
      options?.color ? `color: ${options.color};font-weight: bold;` : undefined,
    );
    if (numberOfChanges > 0) {
      console.table(changes);
    }
    console.groupEnd();

    previous.current = props;
  });
}
