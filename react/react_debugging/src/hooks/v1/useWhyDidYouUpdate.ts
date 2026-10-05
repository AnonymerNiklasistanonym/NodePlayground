import { useEffect, useRef } from "react";

export default function useWhyDidYouUpdate(name: string, props: Record<string, unknown>) {
  const previous = useRef(props);

  useEffect(() => {
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    for (const key of Object.keys(props)) {
      if (!Object.is(previous.current[key], props[key])) {
        changes[key] = {
          from: previous.current[key],
          to: props[key],
        };
      }
    }

    if (Object.keys(changes).length > 0) {
      console.log(`[${name}] changed:`, changes);
    }

    previous.current = props;
  });
}
