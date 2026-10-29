import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
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
    summary: "useState and useReducer, useEffect and its dependency array, refs and memoization hooks, custom hooks, and the rules of hooks.",
  },

  tasks: [
    { id: "2.1", title: "Manage state with useState and useReducer", covers: ["updater functions", "immutable updates of objects and arrays", "lazy initial state", "reducers"] },
    { id: "2.2", title: "Synchronise with useEffect", covers: ["when effects run", "the dependency array", "cleanup", "race conditions and stale closures", "useEffectEvent"] },
    { id: "2.3", title: "Use refs and memoization hooks", covers: ["useRef for DOM nodes and mutable values", "useMemo", "useCallback"] },
    { id: "2.4", title: "Follow the rules of hooks and write custom hooks", covers: ["top-level calls only", "why call order matters", "custom hooks share logic, not state", "external stores"] },
  ],

  lessons: [
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
        "Use the updater form `setX(prev => next)` when the next value depends on the previous one.",
        "Treat state as immutable: create new objects and arrays. React compares with `Object.is`, so a mutated object looks unchanged.",
        "`useState(fn)` (not `useState(fn())`) runs an expensive initialiser only on the first render.",
        "Reach for `useReducer` when many events update related state; reducers must be pure, and `dispatch` is stable between renders.",
      ],
      tip: "If you're asked to add an item to state in a live-coding round, say \"I'll create a new array\" while typing the spread. Interviewers listen for it.",
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
        "Effects synchronise a component with something outside React: a network request, a subscription, a timer, a non-React widget.",
        "List every reactive value the effect reads (props, state, values derived from them). The `react-hooks/exhaustive-deps` lint rule checks this.",
        "Cleanup runs before the effect re-runs and when the component unmounts. Use it to unsubscribe, clear timers, or ignore stale responses.",
        "Objects and functions created during render are new every time; as dependencies they make the effect run after every render.",
        "In development, Strict Mode runs setup → cleanup → setup once on mount to prove your cleanup works.",
      ],
      tip: "The magic phrase: \"Effects are for synchronising with external systems, not for reacting to events.\" Then explain cleanup with a chat-room connect/disconnect example.",
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
        "Store information in a ref when it doesn't affect what's rendered: interval ids, previous values, DOM nodes.",
        "Don't read or write `ref.current` during render (except lazy initialisation); do it in handlers and effects.",
        "`useCallback(fn, deps)` is the same as `useMemo(() => fn, deps)`.",
        "Memoization is an optimisation: it matters when the value is expensive or is passed to a `memo` child or an effect dependency.",
      ],
      tip: "Asked \"useRef vs useState?\": state is for what the user sees and triggers a render; a ref is for what the component needs to remember but doesn't display.",
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
        "Call hooks only at the top level of a component or custom hook: never in conditions, loops, nested functions, or after an early return.",
        "React identifies each hook by its call order, so the order must be the same on every render.",
        "Custom hooks share stateful logic, not state: two components calling `useOnlineStatus()` each get their own.",
        "`use` is the exception: it can be called inside `if` and loops (but still only in components and hooks).",
      ],
      tip: "Explain the \"why\": hooks are stored as a list per component instance; React walks that list in order on each render.",
    },
  ],

  questions: [
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
      explanation: "Updater functions are queued and each receives the result of the previous one: 0 → 1 → 2 → 3.",
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
        "The first is lazy and the second runs every render",
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
        "When you need state shared across the whole app automatically",
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
      explanation: "1 + 4 = 5; the unknown \"oops\" action hits `default` and returns the same state; 5 + 2 = 7.",
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
      explanation: "Line 5 mutates an object shared with the previous state. Strict Mode calls reducers twice in development, so the toggle flips twice; and memoized rows receive the same `todo` object, so they skip rendering. Return `state.map(t => t.id === action.id ? { ...t, done: !t.done } : t)`.",
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
        "Never, because nothing can change",
      ],
      answer: [0],
      explanation: "`[]` means \"depends on nothing reactive\", so it runs after the first commit only. (Strict Mode in development adds one extra setup + cleanup cycle.)",
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
      explanation: "The component body runs during render, the effect runs after commit, and the cleanup runs on unmount.",
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
      explanation: "Omitting the array means \"synchronise after every commit\". It's rarely what you want for fetching or subscriptions.",
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
      explanation: "Effects run after commit. Cleanup of the old effect always comes before the next setup.",
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
        "JavaScript requires functions to be called in order",
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
        "Only if the hook is defined in the same file",
      ],
      answer: [0],
      explanation: "A custom hook is just a function that calls hooks; every call site has its own state. To share state, lift it up, use context, or use an external store.",
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
      explanation: "State holds the delayed value; the effect schedules an update and its cleanup cancels the pending timer whenever `value` changes again, so only the last value within `delay` wins.",
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
        "Remove `theme` from the array and disable the lint rule",
        "`useMemo` around `connect`",
        "`useLayoutEffect` instead of `useEffect`",
      ],
      answer: [0],
      explanation: "`useEffectEvent` (stable in React 19.2) creates a non-reactive function that always sees the latest props and state. Call it from inside the effect; only `roomId` stays a dependency.",
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
        "Store all responses in a module-level object without invalidation",
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
      explanation: "Derived data belongs in render, and dependencies must be honest. Suppressing the linter hides stale-closure bugs; user events belong in event handlers.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-rules",
      level: "staff",
      prompt:
        "A team built its own global store and reads it with `useState` + a `useEffect` subscription. Under concurrent rendering, different components sometimes show different values from the same store in one frame. Which built-in hook is designed for this?",
      options: ["`useSyncExternalStore`", "`useReducer`", "`useDeferredValue`", "`useLayoutEffect`"],
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
      explanation: "State drives the UI, effects sync with external systems, refs hold non-rendered values, memo caches computations, and context passes data deeply.",
    },
  ],

  cards: [
    { id: "c-d2-usestate", domain: "d2", kind: "service", term: "useState", definition: "Returns `[value, setValue]`. The setter accepts a new value or an updater `prev => next`; updates are batched." },
    { id: "c-d2-usereducer", domain: "d2", kind: "service", term: "useReducer", definition: "Returns `[state, dispatch]`. A pure `(state, action) => next` function centralises update logic." },
    { id: "c-d2-useeffect", domain: "d2", kind: "service", term: "useEffect", definition: "Runs setup after commit to synchronise with an external system; cleanup runs before re-running and on unmount." },
    { id: "c-d2-uselayouteffect", domain: "d2", kind: "service", term: "useLayoutEffect", definition: "Like useEffect but fires before the browser paints. For measuring layout; it blocks painting, so use sparingly." },
    { id: "c-d2-useref", domain: "d2", kind: "service", term: "useRef", definition: "A mutable `{ current }` box that persists across renders without causing re-renders. DOM nodes, timer ids." },
    { id: "c-d2-usememo", domain: "d2", kind: "service", term: "useMemo", definition: "Caches the result of a calculation until its dependencies change." },
    { id: "c-d2-usecallback", domain: "d2", kind: "service", term: "useCallback", definition: "Caches a function definition until its dependencies change. Same as `useMemo(() => fn, deps)`." },
    { id: "c-d2-useeffectevent", domain: "d2", kind: "service", term: "useEffectEvent", definition: "Wraps logic that an effect calls but that shouldn't re-trigger it; always sees the latest props and state." },
    { id: "c-d2-usesyncexternalstore", domain: "d2", kind: "service", term: "useSyncExternalStore", definition: "Subscribes to an external store with `subscribe` + `getSnapshot`, consistent under concurrent rendering." },
    { id: "c-d2-useid", domain: "d2", kind: "service", term: "useId", definition: "Generates a unique id that matches between server and client, for accessibility attributes like `htmlFor`." },
    { id: "c-d2-deps", domain: "d2", kind: "concept", term: "Dependency array", definition: "The reactive values an effect or memo reads. Compared with `Object.is`; none = every render, `[]` = mount only." },
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
      hint: "No array runs on every parent render; `[]` never re-runs when userId changes.",
      takeaway: "List exactly the reactive values the effect reads: `[userId]` re-runs when it changes and skips unrelated renders.",
      render: (onSolved) => <EffectDepsLab goal="sync" onSolved={onSolved} />,
    },
    {
      id: "ch-react-race",
      domain: "d2",
      lesson: "d2-effects",
      title: "Win the race condition",
      goal: "Change the user, then resolve the newer request before the older one. The screen must still show the current user when everything has resolved.",
      hint: "Without cleanup, the late response overwrites the right one. Turn on the `ignore` cleanup.",
      takeaway: "Cleanup runs before the next effect, so setting `ignore = true` stops stale responses from winning.",
      render: (onSolved) => <EffectDepsLab goal="race" onSolved={onSolved} />,
    },
  ],
});
