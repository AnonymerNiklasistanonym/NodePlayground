import { useState } from "react";
import useWhyDidYouUpdateV1 from "./hooks/v1/useWhyDidYouUpdate";
import useWhyDidYouUpdateV2 from "./hooks/v2/useWhyDidYouUpdate";

export function Child({
  name,
  count,
  data,
}: {
  name: string;
  count: number;
  data: { value: string };
}) {
  const [localCount, setLocalCount] = useState(0);

  useWhyDidYouUpdateV1(`ChildV1:${name}`, { name, count, data });
  useWhyDidYouUpdateV2(`ChildV2:${name}`, { name, count, data });
  useWhyDidYouUpdateV2(`ChildV2:${name}:CustomColor`, { name, count, data }, { color: "#f59e0b" });

  return (
    <div className="child">
      <h2>Child</h2>

      <p>count prop: {count}</p>
      <p>data.value: {data.value}</p>
      <p>local state: {localCount}</p>

      <button onClick={() => setLocalCount((x) => x + 1)}>Update Child State</button>
    </div>
  );
}
