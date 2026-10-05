import { useMemo, useState } from "react";
import "./App.css";
import { Child } from "./Child";

export default function App() {
  const [count, setCount] = useState(0);
  const [parentCount, setParentCount] = useState(0);

  const data = {
    value: "hello",
  };
  // Memoizing the data or making it constant doesn't do anything
  //const data = useMemo(() => ({
  //  value: "hello",
  //}), []);

  // Memoizing the child component though does matter
  // But if one of the dependencies - data - is different every render
  // this also does not matter
  const childMemoized = useMemo(
    () => (
      <Child
        name={"Memoized"}
        count={count}
        data={data}
        // oxlint-disable-next-line react-hooks/exhaustive-deps
      />
    ),
    [count, data],
  );

  // If all data is memoized triggering a rerender will not rerender
  // the child component unless one of its depencies actually changes
  const dataMemoized = useMemo(
    () => ({
      value: "hello",
    }),
    [],
  );
  const childFullyMemoized = useMemo(
    () => <Child name={"FullyMemoized"} count={count} data={dataMemoized} />,
    [count, dataMemoized],
  );

  return (
    <div className="app">
      <h1>React Render Debugging</h1>

      <button onClick={() => setParentCount((x) => x + 1)}>Re-render Parent</button>

      <button onClick={() => setCount((x) => x + 1)}>Change count prop</button>

      <p>Parent count: {parentCount}</p>

      <Child name={"Default"} count={count} data={data} />
      {childMemoized}
      {childFullyMemoized}
    </div>
  );
}
