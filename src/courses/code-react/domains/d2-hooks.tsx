import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { EffectDepsLab } from "../labs";

/** Domain 2: the core hooks and the rules that make them work. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Hooks",
    world: "Hook Harbor",
    weight: 30,
    emoji: "⚓",
    color: "#a78bfa",
    summary: "The hooks you'll use every day: useState and useReducer for memory, useEffect for outside work, refs, memoization, custom hooks, and the rules that keep them working.",
  },

  tasks: [
    { id: "2.1", title: "Manage state with useState and useReducer", covers: ["updater functions", "immutable updates of objects and arrays", "lazy initial state", "reducers"] },
    { id: "2.2", title: "Synchronise with useEffect", covers: ["when effects run", "the dependency array", "cleanup", "race conditions and stale closures", "useEffectEvent"] },
    { id: "2.3", title: "Use refs and memoization hooks", covers: ["useRef for DOM nodes and mutable values", "useMemo", "useCallback"] },
    { id: "2.4", title: "Follow the rules of hooks and write custom hooks", covers: ["top-level calls only", "why call order matters", "custom hooks share logic, not state", "external stores"] },
  ],

  lessons: [
    {
      id: "d2-b-state",
      level: "beginner",
      task: "2.1",
      title: "State: a component's memory",
      check: ["react-b2-01", "react-b2-02"],
      visual: (
        <CodeBlock
          lang="jsx"
          caption="A counter. `count` is the current value, `setCount` changes it, and 0 is where it starts."
          code={`import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`}
        />
      ),
      points: [
        "**State** is data a component remembers while the app runs, like how many times a button has been clicked.",
        "Think of a scoreboard. It shows the current score, and when someone scores you update it, so everyone sees the new number.",
        "`useState(0)` gives you two things: the current value (`count`) and a function that changes it (`setCount`). The `0` is the starting value.",
        "When you call `setCount`, React draws the component again with the new value. That's how the screen stays up to date.",
      ],
      tip: "A **hook** is a function whose name starts with `use`, like `useState`. Hooks give your components extra abilities, such as memory.",
    },
    {
      id: "d2-b-effect",
      level: "beginner",
      task: "2.2",
      title: "Side jobs with useEffect",
      check: ["react-b2-03", "react-b2-04"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🧮", label: "Render", sub: "React works out the screen" },
              { icon: "🖥️", label: "Screen updates", sub: "The user sees it" },
              { icon: "📌", label: "Effect runs", sub: "Your outside job, like a timer" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            caption="Change the browser tab's title whenever `count` changes."
            code={`useEffect(() => {
  document.title = "Clicked " + count + " times";
}, [count]);`}
          />
        </div>
      ),
      points: [
        "A component's main job is to describe what's on screen. Some work happens outside the screen, like starting a timer or changing the browser tab's title.",
        "`useEffect` is where that outside work goes. React runs it after the screen has updated.",
        "The array at the end is the **dependency list**. React runs the effect again only when one of the values in it changes.",
        "Think of a note that says \"when the score changes, update the sign outside\". The score is the dependency.",
      ],
      tip: "If you can work a value out from data you already have, you don't need an effect. Effects are for talking to things outside React.",
    },
    {
      id: "d2-state",
      level: "junior",
      task: "2.1",
      title: "useState and useReducer",
      check: ["d2-01", "d2-04"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="jsx"
            left={{
              title: "Replace with a value: +1",
              code: `// count = 0
setCount(count + 1);
setCount(count + 1);
setCount(count + 1);
// next render: 1`,
            }}
            right={{
              title: "Queue updater functions: +3",
              code: `// count = 0
setCount((c) => c + 1);
setCount((c) => c + 1);
setCount((c) => c + 1);
// next render: 3`,
            }}
          />
          <CodeCompare
            lang="jsx"
            left={{
              title: "Mutation: React sees the same object",
              code: `user.age = 37;
setUser(user);        // no re-render
todos.push(newTodo);
setTodos(todos);      // no re-render`,
            }}
            right={{
              title: "New objects: React sees a change",
              code: `setUser({ ...user, age: 37 });
setTodos([...todos, newTodo]);
setTodos(todos.filter((t) => t.id !== id));
setTodos(todos.map((t) => t.id === id ? { ...t, done: true } : t));`,
            }}
          />
          <CodeBlock
            lang="jsx"
            caption="useReducer moves update logic into a pure function: (state, action) → next state."
            code={`function reducer(state, action) {
  switch (action.type) {
    case "added":   return [...state, action.todo];
    case "removed": return state.filter((t) => t.id !== action.id);
    default:        return state;
  }
}
const [todos, dispatch] = useReducer(reducer, []);
dispatch({ type: "added", todo });`}
          />
        </div>
      ),
      points: [
        "When the next value depends on the previous one, pass a function to the setter: `setCount(prev => prev + 1)`. This is called the **updater** form.",
        "Never edit state objects or arrays in place. Make new ones instead. React checks whether it got the same object back, and an edited object is still the same object.",
        "Write `useState(fn)`, not `useState(fn())`, when the starting value is slow to work out. Passing the function means React calls it only on the first render.",
        "Use `useReducer` when lots of different events update related state. You write all the update rules in one pure function, and the `dispatch` function never changes between renders.",
      ],
      tip: "If you add an item to state in a live-coding round, say \"I'll create a new array\" while you type the spread. Interviewers listen for it.",
    },
    {
      id: "d2-effects",
      level: "intermediate",
      task: "2.2",
      title: "useEffect and the dependency array",
      check: ["d2-11", "d2-12"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔁", title: "No array", text: "Runs after every render.", color: "#f87171" },
              { icon: "1️⃣", title: "[]", text: "Runs after mount; cleanup on unmount.", color: "#f59e0b" },
              { icon: "🎯", title: "[a, b]", text: "Runs after mount and whenever a or b changes (Object.is).", color: "#34d399" },
            ]}
          />
          <EffectDepsLab />
        </div>
      ),
      points: [
        "An **effect** keeps a component in sync with something outside React, like a network connection, a timer or a map widget from another library.",
        "List every prop, state value or value worked out from them that the effect reads. The `react-hooks/exhaustive-deps` lint rule checks this for you.",
        "The **cleanup** is a function your effect returns. React runs it before the effect runs again and when the component is removed. Use it to unsubscribe, clear timers or ignore old responses.",
        "Objects and functions you create while rendering are new every time. Put one in the dependency list and the effect runs after every render.",
        "In development, Strict Mode runs your effect, then its cleanup, then the effect again when the component first appears. It's a quick test that your cleanup really works.",
      ],
      tip: "A phrase interviewers like: \"Effects are for syncing with outside systems, not for reacting to clicks.\" Then explain cleanup with a chat room that connects and disconnects.",
    },
    {
      id: "d2-refs-memo",
      level: "intermediate",
      task: "2.3",
      title: "useRef, useMemo, useCallback",
      check: ["d2-18", "d2-20"],
      visual: (
        <div className="grid gap-3">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📌", title: "useRef", text: "A mutable box `{ current }` that survives renders. Changing it does not re-render. DOM nodes, timer ids.", color: "#38bdf8" },
              { icon: "🧮", title: "useMemo", text: "Caches a computed value until its dependencies change.", color: "#a78bfa" },
              { icon: "🔗", title: "useCallback", text: "Caches a function definition until its dependencies change.", color: "#f472b6" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            code={`function Search({ items, query }) {
  const inputRef = useRef(null);
  const visible = useMemo(
    () => items.filter((i) => i.name.includes(query)),
    [items, query]
  );
  const focus = useCallback(() => inputRef.current.focus(), []);
  return <><input ref={inputRef} /><List items={visible} onEmpty={focus} /></>;
}`}
          />
        </div>
      ),
      points: [
        "Keep a value in a **ref** when it doesn't change what's on screen. Timer ids, a previous value and DOM elements are good examples.",
        "Don't read or write `ref.current` while rendering, apart from setting it up the first time. Use it in event handlers and effects.",
        "`useMemo` remembers a calculated value. `useCallback(fn, deps)` remembers a function, and it's the same thing as `useMemo(() => fn, deps)`.",
        "**Memoization** means caching a result so you don't redo the work. It's only worth it when the work is slow, or the value goes to a `memo` child or an effect's dependency list.",
      ],
      tip: "Asked about `useRef` versus `useState`? State is for what the user sees, and changing it re-renders. A ref is for what the component remembers but doesn't show.",
    },
    {
      id: "d2-rules",
      level: "intermediate",
      task: "2.4",
      title: "Rules of hooks and custom hooks",
      check: ["d2-22", "d2-25"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="jsx"
            left={{
              title: "Conditional hook: order changes",
              code: `function Profile({ user }) {
  if (!user) return <Spinner />;
  const [tab, setTab] = useState("posts");
  // renders with/without user call
  // a different number of hooks
}`,
            }}
            right={{
              title: "Hooks first, then branch",
              code: `function Profile({ user }) {
  const [tab, setTab] = useState("posts");
  if (!user) return <Spinner />;
  return <Tabs value={tab} onChange={setTab} />;
}`,
            }}
          />
          <CodeBlock
            lang="jsx"
            caption="A custom hook is a function starting with `use` that calls other hooks. Each caller gets its own state."
            code={`function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}`}
          />
        </div>
      ),
      points: [
        "Call hooks only at the top level of a component or custom hook. Never put them inside an `if`, a loop, a nested function, or after an early `return`.",
        "React tells hooks apart by the order you call them in. If the order changes between renders, React hands the wrong state to the wrong hook.",
        "A **custom hook** is your own function that calls other hooks. It shares logic, not state: two components that call `useOnlineStatus()` each get their own copy.",
        "`use` is the one exception. You can call it inside an `if` or a loop, though still only in components and hooks.",
      ],
      tip: "Explain the reason, not just the rule. React stores each component's hooks as a list and walks through it in order on every render.",
    },
  ],

  questions: [
    {
      id: "react-b2-01",
      domain: "d2",
      lesson: "d2-b-state",
      level: "beginner",
      prompt: "What does `useState(0)` give you?",
      options: ["The current value and a function to change it", "A number that can never change once set", "A copy of the whole page", "A connection to a database"],
      answer: [0],
      explanation: "`useState` returns a pair: the value right now and a setter function. The `0` is only the starting value. When you call the setter, the value changes and React draws the component again.",
    },
    {
      id: "react-b2-02",
      type: "fill",
      domain: "d2",
      lesson: "d2-b-state",
      level: "beginner",
      prompt: "Fill the gap so the button can update the counter.",
      code: `const [count, {{1}}] = useState(0);

<button onClick={() => setCount(count + 1)}>
  {count}
</button>`,
      codeLang: "jsx",
      blanks: [{ options: ["setCount", "count", "useCount", "updateState"], answer: 0 }],
      explanation: "The second item in the pair is the setter, and by habit you name it `set` plus the value's name. The button calls `setCount`, so that's the name it needs here.",
    },
    {
      id: "react-b2-03",
      domain: "d2",
      lesson: "d2-b-effect",
      level: "beginner",
      prompt: "When does React run the code inside `useEffect`?",
      options: ["After the component has appeared on the screen", "Before the component's code is read in at all", "Only when the user closes the page", "Never: it's only a comment"],
      answer: [0],
      explanation: "React draws the screen first and then runs your effect. That way the effect can work with a page that's already there, for example to set the tab title.",
    },
    {
      id: "react-b2-04",
      domain: "d2",
      lesson: "d2-b-effect",
      level: "beginner",
      prompt: "After the first run, when will this effect run again?",
      code: `useEffect(() => {
  document.title = name;
}, [name]);`,
      codeLang: "jsx",
      options: ["Whenever `name` changes", "On every key press anywhere in the app", "Never again", "Once every second"],
      answer: [0],
      explanation: "The dependency list is `[name]`, so React runs the effect again only when `name` has a new value. If nothing in the list changed, React skips it.",
    },
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-state",
      level: "junior",
      prompt: "`n` starts at 0. What is `n` after one click?",
      code: `const [n, setN] = useState(0);

function handleClick() {
  setN((c) => c + 1);
  setN((c) => c + 1);
  setN((c) => c + 1);
}`,
      codeLang: "jsx",
      options: ["3", "1", "0", "It depends on timing"],
      answer: [0],
      explanation: "Updater functions wait in a queue, and each one gets the result of the one before. So the value goes from 0 to 1, then 2, then 3.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-state",
      level: "intermediate",
      prompt: "`n` starts at 0. What is `n` after one click?",
      code: `function handleClick() {
  setN(n + 5);
  setN((c) => c + 1);
}`,
      codeLang: "jsx",
      options: ["6", "1", "5", "0"],
      answer: [0],
      explanation: "The queue is processed in order: \"replace with 0 + 5\" gives 5, then the updater adds 1 to get 6.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-state",
      level: "intermediate",
      type: "lines",
      prompt: "New todos never appear on screen. Tap the two lines that together cause it.",
      code: `function TodoList() {
  const [todos, setTodos] = useState([]);
  function add(text) {
    todos.push({ id: crypto.randomUUID(), text });
    setTodos(todos);
  }
  return <List items={todos} onAdd={add} />;
}`,
      codeLang: "jsx",
      answer: [4, 5],
      explanation: "Line 4 mutates the existing array and line 5 passes the same reference back. `Object.is(old, new)` is true, so React skips the update. Use `setTodos([...todos, { id, text }])`.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-state",
      level: "junior",
      prompt: "State is `const [user, setUser] = useState({ name: \"Ada\", age: 36 })`. Which call correctly updates only the age?",
      options: ["`setUser({ ...user, age: 37 })`", "`user.age = 37; setUser(user)`", "`setUser({ age: 37 })`", "`setUser.age(37)`"],
      answer: [0],
      explanation: "Copy the old fields with spread and override `age`. Mutating doesn't trigger a render, and `setUser({ age: 37 })` replaces the whole object, losing `name` (useState doesn't merge).",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-state",
      level: "intermediate",
      prompt: "What's the difference between these two lines?",
      code: `const [rows, setRows] = useState(parseCsv(bigFile));
const [rows, setRows] = useState(() => parseCsv(bigFile));`,
      codeLang: "jsx",
      options: [
        "The first parses the file on every render (and ignores the result after the first); the second parses only on the first render",
        "They are identical",
        "The second stores a function in state",
        "The first is lazy and only parses on the first render; the second runs `parse` on every render and stores each new result in state",
      ],
      answer: [0],
      explanation: "Passing a function to `useState` makes it a lazy initialiser that React calls once. Passing `parseCsv(bigFile)` evaluates it on every render even though only the first value is used.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-state",
      level: "intermediate",
      prompt: "When is `useReducer` a better fit than several `useState` calls?",
      options: [
        "When many different events update related pieces of state and you want the update logic in one pure, testable function",
        "Whenever state is a number",
        "When you need state shared across the whole app automatically, without passing anything through props or through context",
        "When you need to perform side effects during updates",
      ],
      answer: [0],
      explanation: "A reducer centralises \"what happens on each action\". It must stay pure: no fetching or mutation inside. Sharing across the tree still needs context or a store.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-state",
      level: "junior",
      prompt: "What is logged?",
      code: `function reducer(state, action) {
  switch (action.type) {
    case "add": return { count: state.count + action.by };
    case "reset": return { count: 0 };
    default: return state;
  }
}
let s = { count: 1 };
s = reducer(s, { type: "add", by: 4 });
s = reducer(s, { type: "oops" });
s = reducer(s, { type: "add", by: 2 });
console.log(s.count);`,
      codeLang: "js",
      options: ["7", "0", "5", "It throws on the unknown action"],
      answer: [0],
      explanation: "Adding 4 to 1 gives 5. The unknown \"oops\" action falls through to `default`, which returns the state unchanged. Then adding 2 gives 7.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-state",
      level: "senior",
      type: "lines",
      prompt: "In development, clicking a todo sometimes seems to do nothing, and memoized rows don't update. Tap the buggy line.",
      code: `function reducer(state, action) {
  switch (action.type) {
    case "toggle": {
      const todo = state.find((t) => t.id === action.id);
      todo.done = !todo.done;
      return [...state];
    }
    default:
      return state;
  }
}`,
      codeLang: "js",
      answer: [5],
      explanation: "Line 5 edits an object that the previous state still uses. Strict Mode calls reducers twice in development, so the toggle flips twice. Memoized rows also get the same `todo` object, so they skip rendering. Return `state.map(t => t.id === action.id ? { ...t, done: !t.done } : t)`.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-effects",
      level: "junior",
      prompt: "When does an effect with an empty dependency array `[]` run?",
      options: [
        "Once after the component mounts; its cleanup runs when it unmounts",
        "Before every render",
        "After every render",
        "Never, because nothing in the empty dependency array can ever change",
      ],
      answer: [0],
      explanation: "`[]` means the effect depends on nothing that changes, so it runs only after the first render. In development, Strict Mode adds one extra run and cleanup to test it.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-effects",
      level: "junior",
      prompt: "`App` mounts once and later unmounts (no Strict Mode). What is logged, in order?",
      code: `function App() {
  console.log("render");
  useEffect(() => {
    console.log("effect");
    return () => console.log("cleanup");
  }, []);
  return null;
}`,
      codeLang: "jsx",
      options: ["render, effect, cleanup", "effect, render, cleanup", "render, cleanup, effect", "render, effect"],
      answer: [0],
      explanation: "The component's body runs while rendering. The effect runs after React has updated the page. The cleanup runs when the component is removed.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-effects",
      level: "intermediate",
      prompt: "`roomId` changes from \"a\" to \"b\". What does that change log?",
      code: `useEffect(() => {
  console.log("connect", roomId);
  return () => console.log("disconnect", roomId);
}, [roomId]);`,
      codeLang: "jsx",
      options: ["disconnect a, then connect b", "connect b, then disconnect a", "disconnect b, then connect b", "connect b only"],
      answer: [0],
      explanation: "Before re-running, React runs the previous effect's cleanup, which closed over the old `roomId` (\"a\"). Then the new effect runs with \"b\".",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-effects",
      level: "intermediate",
      type: "lines",
      prompt: "Typing a new query never updates the results. Tap the buggy line.",
      code: `function Results({ query }) {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let ignore = false;
    search(query).then((r) => {
      if (!ignore) setItems(r);
    });
    return () => { ignore = true; };
  }, []);
  return <List items={items} />;
}`,
      codeLang: "jsx",
      answer: [9],
      explanation: "The effect reads `query` but the dependency array is empty, so it only runs on mount. Use `[query]`. The `ignore` flag already handles out-of-order responses.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-effects",
      level: "senior",
      type: "lines",
      prompt: "This timer shows 1s and then stops counting. Tap the buggy line.",
      code: `function Timer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{seconds}s</p>;
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "A stale closure: the interval callback captured `seconds = 0` from the first render, so it sets 1 forever. Use the updater `setSeconds(s => s + 1)`, which doesn't need `seconds` as a dependency.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-effects",
      level: "senior",
      prompt: "The user types \"hi\", clicks Send, then types \" there\" within 3 seconds. What does the alert show?",
      code: `function Chat() {
  const [text, setText] = useState("");
  function send() {
    setTimeout(() => alert(text), 3000);
  }
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </>
  );
}`,
      codeLang: "jsx",
      options: ["hi", "hi there", "An empty string", " there"],
      answer: [0],
      explanation: "`send` was created during the render where `text` was \"hi\", so the timeout's closure sees that snapshot. Later renders make new `text` constants but don't change the old one.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-effects",
      level: "senior",
      type: "lines",
      prompt: "This component fetches in an endless loop. Tap the line that creates the value which makes the effect run after every render.",
      code: `function Profile({ id }) {
  const [user, setUser] = useState(null);
  const options = { id, include: "posts" };
  useEffect(() => {
    fetchUser(options).then(setUser);
  }, [options]);
  return <Card user={user} />;
}`,
      codeLang: "jsx",
      answer: [3],
      explanation: "`options` is a new object on every render, so the dependency always \"changes\". Each fetch sets state, which re-renders, which creates a new object, and so on. Create the object inside the effect and depend on `[id]`.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-effects",
      level: "junior",
      prompt: "An effect has no dependency array at all. When does it run?",
      options: ["After every render", "Only on mount", "Only when props change", "Only on unmount"],
      answer: [0],
      explanation: "Leaving out the array tells React to run the effect after every render. That's rarely what you want for fetching data or subscribing to something.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-effects",
      level: "intermediate",
      type: "order",
      prompt: "A component with `useEffect(…, [id])` receives a new `id`. Put what happens in order.",
      items: [
        "React calls the component with the new props",
        "React commits the DOM changes",
        "React runs the previous effect's cleanup (with the old id)",
        "React runs the effect again with the new id",
      ],
      explanation: "Effects run after React has updated the page. The old effect's cleanup always runs before the new effect starts.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-refs-memo",
      level: "junior",
      prompt: "The button is clicked three times. What does its label say?",
      code: `function Clicker() {
  const clicks = useRef(0);
  return (
    <button onClick={() => { clicks.current++; }}>
      Clicked {clicks.current} times
    </button>
  );
}`,
      codeLang: "jsx",
      options: ["Clicked 0 times", "Clicked 3 times", "Clicked 1 times", "It throws because refs are read-only"],
      answer: [0],
      explanation: "`clicks.current` does reach 3, but changing a ref doesn't trigger a render, so the label never updates. Use state for anything shown on screen.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-refs-memo",
      level: "intermediate",
      prompt: "Which are good uses of `useRef`? (Choose two.)",
      options: [
        "Holding an interval id so a later handler can clear it",
        "Getting a DOM node to call `focus()` on it",
        "Storing the heading text so the heading updates when it changes",
        "Replacing all useState calls to make the app faster",
        "Caching a value derived from props for display",
      ],
      answer: [0, 1],
      explanation: "Refs remember values that don't affect rendering and give access to DOM nodes. Anything shown on screen belongs in state (or is computed during render).",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-refs-memo",
      level: "senior",
      prompt: "Which expression is equivalent to `useCallback(fn, deps)`?",
      options: ["`useMemo(() => fn, deps)`", "`useMemo(fn, deps)`", "`useRef(fn)`", "`useEffect(fn, deps)`"],
      answer: [0],
      explanation: "useCallback caches the function itself. `useMemo(fn, deps)` would call `fn` and cache its return value instead.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-rules",
      level: "junior",
      type: "lines",
      prompt: "Tap the line that breaks the rules of hooks.",
      code: `function Settings({ advanced }) {
  const [name, setName] = useState("");
  if (advanced) {
    useEffect(() => {
      document.title = name;
    });
  }
  return <input value={name} onChange={(e) => setName(e.target.value)} />;
}`,
      codeLang: "jsx",
      answer: [4],
      explanation: "`useEffect` is called inside a condition, so the number of hooks changes when `advanced` flips. Call it unconditionally and put the `if` inside the effect.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-rules",
      level: "intermediate",
      type: "lines",
      prompt: "React warns \"Rendered more hooks than during the previous render\" once `user` loads. Tap the line that breaks the rules of hooks.",
      code: `function Profile({ user }) {
  if (!user) {
    return <p>Loading…</p>;
  }
  const [tab, setTab] = useState("posts");
  return <Tabs value={tab} onChange={setTab} />;
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "A hook after an early return is conditional: the first render calls no hooks, later ones call one. Move `useState` above the `if`.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-rules",
      level: "senior",
      prompt: "Why must hooks be called in the same order on every render?",
      options: [
        "React stores each component's hook state in an ordered list and matches calls by position, not by name",
        "JavaScript requires functions to be called in the same order every time, or else it throws a TypeError",
        "Hooks are compiled into class methods",
        "It's only a lint rule with no runtime effect",
      ],
      answer: [0],
      explanation: "The second `useState` call always gets the second slot. If a call is skipped, every later hook reads the wrong slot's state.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-rules",
      level: "intermediate",
      prompt: "Two components on the same page both call a custom `useOnlineStatus()` hook. Do they share state?",
      options: [
        "No: each call gets its own independent state; custom hooks share logic, not state",
        "Yes: custom hooks are singletons",
        "Yes, but only if they're siblings",
        "Only if the hook is defined in the same file as both of the components that call it",
      ],
      answer: [0],
      explanation: "A custom hook is just a function that calls hooks, and every place that calls it gets its own state. To share state, lift it up, use context, or use an external store.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-rules",
      level: "intermediate",
      type: "order",
      prompt: "Arrange the lines of a `useDebounced` custom hook.",
      items: [
        "function useDebounced(value, delay) {",
        "const [debounced, setDebounced] = useState(value);",
        "useEffect(() => {",
        "const id = setTimeout(() => setDebounced(value), delay);",
        "return () => clearTimeout(id);",
        "}, [value, delay]);",
        "return debounced;",
      ],
      explanation: "State holds the delayed value. The effect starts a timer to update it, and the cleanup cancels that timer whenever `value` changes again. So only the last value typed within `delay` gets through.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-effects",
      level: "senior",
      prompt: "A chat effect connects to `roomId` and shows a notification styled with `theme`. Adding `theme` to the dependencies makes it reconnect whenever the theme changes. Which React API is designed for this?",
      code: `useEffect(() => {
  const conn = connect(roomId);
  conn.on("connected", () => notify("Connected!", theme));
  return () => conn.disconnect();
}, [roomId, theme]);`,
      codeLang: "jsx",
      options: [
        "`useEffectEvent`: wrap the notify logic so it reads the latest `theme` without being a dependency",
        "Remove `theme` from the dependency array and disable the exhaustive-deps lint rule for that one line",
        "`useMemo` around `connect`",
        "`useLayoutEffect` instead of `useEffect`",
      ],
      answer: [0],
      explanation: "`useEffectEvent`, stable since React 19.2, creates a function that always sees the latest props and state but doesn't count as a dependency. Call it from inside the effect, and only `roomId` stays in the list.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-effects",
      level: "staff",
      prompt:
        "Forty components use a hand-rolled `useFetch(url)` hook (useEffect + useState). You're seeing race conditions, duplicate requests, and no caching. What's the best recommendation?",
      options: [
        "Move data fetching to a layer built for it (your framework's data APIs or a library such as TanStack Query) that caches, deduplicates, and handles races",
        "Add more dependencies to the hook's effect",
        "Fetch inside `useMemo` so results are cached",
        "Store all responses in a module-level object without any invalidation, keyed by URL, so every component that asks for the same data gets it back instantly",
      ],
      answer: [0],
      explanation: "The React docs recommend frameworks or client caching libraries over raw effects for data fetching: effects don't run on the server, create waterfalls, and leave caching and races to you.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-effects",
      level: "staff",
      prompt: "You're writing team guidelines for `useEffect`. Which two rules belong in them? (Choose two.)",
      options: [
        "Don't use an effect to transform data for rendering; compute it during render",
        "Every reactive value the effect reads goes in the dependency array; change the code instead of suppressing the lint rule",
        "Disable `exhaustive-deps` whenever it causes a loop",
        "Prefer effects for responding to clicks and form submits",
        "Use `[]` everywhere so each effect runs only once",
      ],
      answer: [0, 1],
      explanation: "Values you can work out belong in render, and the dependency list must be honest. Silencing the linter hides stale-closure bugs. Reactions to the user belong in event handlers.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-rules",
      level: "staff",
      prompt:
        "A team built its own global store and reads it with `useState` + a `useEffect` subscription. Under concurrent rendering, different components sometimes show different values from the same store in one frame. Which built-in hook is designed for this?",
      options: ["`useSyncExternalStore`", "`useReducer`", "`useDeferredValue()`", "`useLayoutEffect`"],
      answer: [0],
      explanation: "`useSyncExternalStore(subscribe, getSnapshot)` lets React read an external store consistently during concurrent renders (no tearing). Store libraries use it under the hood.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-refs-memo",
      level: "junior",
      type: "match",
      prompt: "Match each hook to its job.",
      pairs: [
        ["`useState`", "Remember a value and re-render when it changes"],
        ["`useEffect`", "Synchronise with something outside React after render"],
        ["`useRef`", "Keep a mutable value or DOM node without re-rendering"],
        ["`useMemo`", "Cache an expensive calculation between renders"],
        ["`useContext`", "Read a value provided higher up the tree"],
      ],
      explanation: "State drives what's on screen. Effects sync with outside systems. Refs hold values you don't show. Memoization caches calculations. Context passes data deep into the tree.",
    },
  ],

  cards: [
    { id: "c-d2-usestate", domain: "d2", kind: "service", term: "useState", definition: "Returns `[value, setValue]`. You pass the setter either a new value or a function that gets the previous value. React groups several updates into one render." },
    { id: "c-d2-usereducer", domain: "d2", kind: "service", term: "useReducer", definition: "Returns `[state, dispatch]`. One pure function takes the current state and an action and returns the next state, so all your update rules live in one place." },
    { id: "c-d2-useeffect", domain: "d2", kind: "service", term: "useEffect", definition: "Runs your code after React updates the page, to stay in sync with something outside React. Its cleanup runs before the next run and when the component is removed." },
    { id: "c-d2-uselayouteffect", domain: "d2", kind: "service", term: "useLayoutEffect", definition: "Like useEffect, but it runs before the browser paints the screen. Use it to measure layout. It holds up painting, so use it sparingly." },
    { id: "c-d2-useref", domain: "d2", kind: "service", term: "useRef", definition: "A box, `{ current }`, that keeps a value between renders without causing re-renders. Handy for DOM elements and timer ids." },
    { id: "c-d2-usememo", domain: "d2", kind: "service", term: "useMemo", definition: "Caches the result of a calculation until its dependencies change." },
    { id: "c-d2-usecallback", domain: "d2", kind: "service", term: "useCallback", definition: "Caches a function definition until its dependencies change. Same as `useMemo(() => fn, deps)`." },
    { id: "c-d2-useeffectevent", domain: "d2", kind: "service", term: "useEffectEvent", definition: "Wraps logic that an effect calls but that shouldn't make the effect run again. It always sees the latest props and state." },
    { id: "c-d2-usesyncexternalstore", domain: "d2", kind: "service", term: "useSyncExternalStore", definition: "Reads from a store outside React using `subscribe` and `getSnapshot`, and keeps every component seeing the same value even during concurrent rendering." },
    { id: "c-d2-useid", domain: "d2", kind: "service", term: "useId", definition: "Generates a unique id that matches between server and client, for accessibility attributes like `htmlFor`." },
    { id: "c-d2-deps", domain: "d2", kind: "concept", term: "Dependency array", definition: "The props and state an effect or memo reads, checked with `Object.is`. With no array it runs after every render. With `[]` it runs only once, when the component first appears." },
    { id: "c-d2-cleanup", domain: "d2", kind: "concept", term: "Effect cleanup", definition: "The function an effect returns. Runs before the next setup and on unmount: unsubscribe, clear timers, ignore stale results." },
    { id: "c-d2-stale", domain: "d2", kind: "concept", term: "Stale closure", definition: "A callback that captured old props or state from an earlier render. Fix with correct deps or updater functions." },
    { id: "c-d2-rules", domain: "d2", kind: "concept", term: "Rules of hooks", definition: "Call hooks only at the top level of components and custom hooks, so the call order is identical every render." },
    { id: "c-d2-custom", domain: "d2", kind: "concept", term: "Custom hook", definition: "A `use…` function that calls other hooks to reuse stateful logic. Each caller gets its own state." },
    { id: "c-d2-immutable", domain: "d2", kind: "concept", term: "Immutable update", definition: "Create new objects and arrays (spread, map, filter) instead of mutating, so React sees a new reference." },
  ],

  challenges: [
    {
      id: "ch-react-deps",
      domain: "d2",
      lesson: "d2-effects",
      title: "Right dependencies, no wasted runs",
      goal: "Pick a dependency array, re-render the parent at least once, change the userId at least once, then resolve every request. The screen must match the prop and the effect must never run without a reason.",
      hint: "With no array, the effect runs on every parent render. With `[]`, it never runs again when userId changes.",
      takeaway: "List exactly the values the effect reads. `[userId]` runs again when the user changes and skips renders that have nothing to do with it.",
      render: (onSolved) => <EffectDepsLab goal="sync" onSolved={onSolved} />,
    },
    {
      id: "ch-react-race",
      domain: "d2",
      lesson: "d2-effects",
      title: "Win the race condition",
      goal: "Change the user, then resolve the newer request before the older one. The screen must still show the current user when everything has resolved.",
      hint: "Without a cleanup, the response that arrives last overwrites the right one. Turn on the `ignore` cleanup.",
      takeaway: "Cleanup runs before the next effect, so setting `ignore = true` stops stale responses from winning.",
      render: (onSolved) => <EffectDepsLab goal="race" onSolved={onSolved} />,
    },
  ],
});
