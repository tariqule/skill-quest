import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { RenderCounterLab } from "../labs";

/** Domain 4: performance, Suspense and transitions, React 19 Actions, and the React Compiler. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Performance and Modern React",
    world: "The Concurrent Citadel",
    weight: 25,
    emoji: "🏰",
    color: "#f59e0b",
    summary: "memo and avoiding needless renders, Suspense, lazy and transitions, React 19 Actions and hooks, the React Compiler, and app-scale decisions.",
  },

  tasks: [
    { id: "4.1", title: "Avoid needless renders", covers: ["memo and shallow comparison", "stable props", "profiling first", "virtualising long lists"] },
    { id: "4.2", title: "Use Suspense, lazy, and transitions", covers: ["Suspense boundaries", "lazy()", "useTransition / startTransition", "useDeferredValue", "use()"] },
    { id: "4.3", title: "Use React 19 Actions", covers: ["form actions", "useActionState", "useFormStatus", "useOptimistic", "ref as a prop"] },
    { id: "4.4", title: "Scale React apps", covers: ["the React Compiler", "error boundaries", "code splitting", "data waterfalls", "incremental migration"] },
  ],

  lessons: [
    {
      id: "d4-memo",
      level: "senior",
      task: "4.1",
      title: "memo and the re-render budget",
      check: ["d4-01", "d4-05"],
      visual: (
        <div className="grid gap-4">
          <RenderCounterLab />
          <CodeCompare
            lang="jsx"
            left={{
              title: "memo defeated: new props every render",
              code: `<Row
  item={item}
  style={{ padding: 8 }}
  onPick={() => pick(item.id)}
/>`,
            }}
            right={{
              title: "Stable props: memo can skip",
              code: `const style = useMemo(() => ({ padding: 8 }), []);
const onPick = useCallback((id) => pick(id), [pick]);
<Row item={item} style={style} onPick={onPick} />`,
            }}
          />
        </div>
      ),
      points: [
        "`memo(Component)` skips a re-render when every prop is `Object.is`-equal to last time.",
        "New objects, arrays, and functions created during render break that comparison; `useMemo` and `useCallback` keep them stable.",
        "Moving state down (or passing components as `children`) often removes renders without any memoization.",
        "Measure first with the React DevTools Profiler; for very long lists, virtualise so only visible rows render.",
      ],
      tip: "Lead with \"move state down\" before \"add memo\". It shows you fix the cause, not the symptom.",
    },
    {
      id: "d4-suspense",
      level: "senior",
      task: "4.2",
      title: "Suspense, lazy, and transitions",
      check: ["d4-08", "d4-10"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="jsx"
            code={`const Chart = lazy(() => import("./Chart")); // module top level

function Dashboard({ statsPromise }) {
  const [tab, setTab] = useState("summary");
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <Tabs value={tab} dim={isPending}
        onChange={(t) => startTransition(() => setTab(t))} />
      <Suspense fallback={<Spinner />}>
        {tab === "chart" ? <Chart /> : <Summary statsPromise={statsPromise} />}
      </Suspense>
    </>
  );
}

function Summary({ statsPromise }) {
  const stats = use(statsPromise); // suspends until resolved
  return <p>{stats.total}</p>;
}`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "⏳", title: "Suspense", text: "Shows a fallback while something inside suspends: lazy code, `use(promise)`, or a Suspense-enabled framework.", color: "#f59e0b" },
              { icon: "🐢", title: "useTransition", text: "Marks an update as non-urgent. The old UI stays visible and interactive while the new one renders.", color: "#38bdf8" },
              { icon: "🪞", title: "useDeferredValue", text: "Gives a lagging copy of a value so an expensive child can catch up while input stays snappy.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Suspense doesn't detect data fetched inside effects; only Suspense-enabled sources trigger the fallback.",
        "Declare `lazy` components at module level, never inside a component.",
        "Updates inside a transition won't replace already-visible content with a fallback; React keeps showing the old UI.",
        "`use(promise)` and `use(context)` can be called conditionally. Pass promises created outside render (for example from a server or a cache).",
      ],
      tip: "Describe boundaries as a design choice: \"Where do I want a loading state?\" Put a boundary there, not around every component.",
    },
    {
      id: "d4-actions",
      level: "intermediate",
      task: "4.3",
      title: "React 19 Actions",
      check: ["d4-13", "d4-16"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📝", label: "Submit", sub: "<form action={formAction}>" },
              { icon: "⏳", label: "Pending", sub: "isPending / useFormStatus().pending" },
              { icon: "✨", label: "Optimistic", sub: "useOptimistic shows the expected result" },
              { icon: "📬", label: "Action runs", sub: "(prevState, formData) => newState" },
              { icon: "✅", label: "Settle", sub: "New state; optimistic value replaced by real data" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            code={`function AddToCart({ productId }) {
  const [message, formAction, isPending] = useActionState(
    async (prevState, formData) => {
      const res = await addToCart(formData.get("qty"), productId);
      return res.ok ? "Added!" : "Couldn't add";
    },
    null
  );
  return (
    <form action={formAction}>
      <input name="qty" type="number" defaultValue={1} />
      <SubmitButton />
      {message && <p>{message}</p>}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus(); // reads the parent <form>
  return <button disabled={pending}>Add</button>;
}`}
          />
        </div>
      ),
      points: [
        "An Action is an async function run in a transition. `<form action={fn}>` calls it with the form's `FormData` and resets uncontrolled fields after success.",
        "`useActionState(action, initialState)` returns `[state, formAction, isPending]`; the action receives `(previousState, formData)`.",
        "`useFormStatus()` (from react-dom) gives `{ pending, data, method, action }` for the parent form, so it must be called in a component rendered inside that form.",
        "`useOptimistic(state, updateFn)` shows an expected value while an Action is pending, then falls back to the real state.",
        "Function components can take `ref` as a normal prop in React 19, so `forwardRef` is no longer needed.",
      ],
      tip: "If asked what changed in React 19, lead with Actions: pending state, errors, optimistic updates, and forms handled by React instead of hand-written loading flags.",
    },
    {
      id: "d4-scale",
      level: "staff",
      task: "4.4",
      title: "The React Compiler and React at scale",
      check: ["d4-19", "d4-21"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="jsx"
            left={{
              title: "Hand-memoized",
              code: `const Row = memo(function Row({ item, onPick }) {
  …
});
function Table({ items, pick }) {
  const sorted = useMemo(() => sortRows(items), [items]);
  const onPick = useCallback((id) => pick(id), [pick]);
  return sorted.map((r) => <Row key={r.id} item={r} onPick={onPick} />);
}`,
            }}
            right={{
              title: "With the React Compiler",
              code: `function Row({ item, onPick }) {
  …
}
function Table({ items, pick }) {
  const sorted = sortRows(items);
  return sorted.map((r) => (
    <Row key={r.id} item={r} onPick={(id) => pick(id)} />
  ));
}
// memoized automatically at build time`,
            }}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🤖", title: "React Compiler", text: "A build-time tool that memoizes components and values automatically. It relies on code following the Rules of React.", color: "#f59e0b" },
              { icon: "🧯", title: "Error boundaries", text: "Catch render errors in a subtree and show a fallback. Place them around routes and independent widgets.", color: "#f87171" },
              { icon: "✂️", title: "Code splitting", text: "`lazy` + Suspense at route and heavy-widget boundaries keeps the first bundle small.", color: "#38bdf8" },
              { icon: "🌊", title: "Waterfalls", text: "Child fetches that start only after the parent's fetch finishes. Start requests early and in parallel.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The compiler removes most manual `memo`/`useMemo`/`useCallback`; code that breaks the Rules of React (mutation during render, conditional hooks) is skipped or may misbehave.",
        "Adopt it incrementally (a directory or feature at a time) with its lint rules on, and keep existing memoization until you've verified behaviour.",
        "Error boundaries are still class components (`getDerivedStateFromError` / `componentDidCatch`) or a library wrapper; they don't catch errors in event handlers or async code.",
        "Class components still work in React 19, so migrations can be incremental rather than big-bang rewrites.",
      ],
      tip: "Staff-level answers name the rollout plan: measure, pilot on one area, add guardrails (lint, tests, monitoring), then expand.",
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-memo",
      level: "senior",
      prompt: "`Row` is wrapped in `memo`, yet selecting any row re-renders every row. Why?",
      code: `const Row = memo(function Row({ item, onSelect }) {
  return <li onClick={onSelect}>{item.name}</li>;
});

function Table({ items }) {
  const [selected, setSelected] = useState(null);
  return items.map((item) => (
    <Row key={item.id} item={item} onSelect={() => setSelected(item.id)} />
  ));
}`,
      codeLang: "jsx",
      options: [
        "Each render creates a new arrow function for `onSelect`, so memo's shallow comparison sees a changed prop",
        "memo only works on class components",
        "`key` changes on every render",
        "memo compares props deeply and `item` is too large",
      ],
      answer: [0],
      explanation: "`() => setSelected(item.id)` is a new function each render. Pass a stable function instead, for example `onSelect={setSelected}` and let `Row` call `onSelect(item.id)`, so memo can skip the rows whose props didn't change.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-memo",
      level: "senior",
      prompt: "How does `memo` decide whether to skip re-rendering?",
      options: [
        "It compares each prop with the previous one using `Object.is` (a shallow comparison)",
        "It deep-compares every prop recursively",
        "It compares the rendered output",
        "It skips whenever the component has no state",
      ],
      answer: [0],
      explanation: "memo is shallow: equal primitives and identical references pass; a new object with the same contents doesn't. You can pass a custom compare function, but that's rarely needed.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-memo",
      level: "intermediate",
      prompt: "A screen feels slow. What should you do before adding `memo`, `useMemo`, or `useCallback`?",
      options: [
        "Profile it (React DevTools Profiler, production-like build) to find which renders are actually expensive",
        "Wrap every component in memo, then remove the ones that don't help",
        "Convert all state to refs",
        "Rewrite the screen with class components",
      ],
      answer: [0],
      explanation: "Memoization has a cost and only helps where renders are expensive or frequent. Measure first, then fix the hot spots, often by restructuring state.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-memo",
      level: "senior",
      type: "lines",
      prompt: "Changing `filter` doesn't update the table. Tap the buggy line.",
      code: `function Report({ rows, filter }) {
  const visible = useMemo(
    () => rows.filter((r) => r.tag === filter),
    [rows]
  );
  return <Table rows={visible} />;
}`,
      codeLang: "jsx",
      answer: [4],
      explanation: "The memo reads `filter` but only lists `rows`, so it keeps returning the cached result. Dependencies must include `filter`: `[rows, filter]`.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-memo",
      level: "senior",
      prompt: "`Row` is wrapped in `memo` but re-renders every time its parent renders. Which two props cause it? (Choose two.)",
      code: `<Row
  id={item.id}
  label={item.label}
  style={{ padding: 8 }}
  onPick={() => pick(item.id)}
  selected={selectedId === item.id}
/>`,
      codeLang: "jsx",
      options: ["`style`", "`onPick`", "`id`", "`label`", "`selected`"],
      answer: [0, 1],
      explanation: "The object literal and the arrow function are recreated on every render. The primitives (`id`, `label`, the boolean `selected`) compare equal unless they really change.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-memo",
      level: "senior",
      prompt: "A list of 10,000 rows is slow on first render even though each row is cheap. What helps most?",
      options: [
        "Virtualise (window) the list so only the rows in view are rendered",
        "Wrap each row in memo",
        "Use index keys",
        "Move the list into context",
      ],
      answer: [0],
      explanation: "memo helps re-renders, not the first render. Rendering fewer DOM nodes is the fix: libraries like react-window or TanStack Virtual render only what's visible.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-suspense",
      level: "junior",
      prompt: "What does `<Suspense fallback={<Spinner />}>` do?",
      options: [
        "Shows the fallback while components inside it are waiting (for lazy code or data that suspends), then shows them",
        "Delays rendering by a fixed time",
        "Catches errors thrown by its children",
        "Prevents its children from ever re-rendering",
      ],
      answer: [0],
      explanation: "Suspense is a loading boundary. Errors are handled by error boundaries, not Suspense.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-suspense",
      level: "senior",
      type: "lines",
      prompt: "The chart reloads and loses its state every time `App` re-renders. Tap the buggy line.",
      code: `import { lazy, Suspense } from "react";

function App() {
  const Chart = lazy(() => import("./Chart"));
  return (
    <Suspense fallback={<Spinner />}>
      <Chart />
    </Suspense>
  );
}`,
      codeLang: "jsx",
      answer: [4],
      explanation: "Calling `lazy` inside the component creates a new component type on each render, so React remounts it. Declare it once at the top level of the module.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-suspense",
      level: "senior",
      prompt: "A component fetches in `useEffect` and stores the result in state. Will a surrounding `<Suspense>` show its fallback while it loads?",
      options: [
        "No: only Suspense-enabled sources (lazy, `use(promise)`, Suspense-aware frameworks) trigger the fallback",
        "Yes: Suspense detects any pending fetch",
        "Yes, but only on the first render",
        "Only if the effect is async",
      ],
      answer: [0],
      explanation: "Suspense works when a component suspends during render. An effect runs after render, so the component already rendered its own loading UI.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-suspense",
      level: "senior",
      prompt: "Why wrap `setTab` in `startTransition` here?",
      code: `const [isPending, startTransition] = useTransition();

function selectTab(next) {
  startTransition(() => {
    setTab(next);
  });
}`,
      codeLang: "jsx",
      options: [
        "So rendering the new tab is non-urgent: React keeps the current UI visible and responsive, can interrupt the render, and won't swap in a Suspense fallback",
        "So the tab change happens synchronously before paint",
        "To batch it with other updates, which wouldn't happen otherwise",
        "To cache the tab's content",
      ],
      answer: [0],
      explanation: "Transitions mark updates as interruptible. `isPending` lets you dim the old tab while the new one renders in the background.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-suspense",
      level: "senior",
      prompt: "Typing in a search box lags because it filters a huge list on every keystroke. Which hook lets the input update immediately while the list renders with a slightly older value?",
      options: ["`useDeferredValue`", "`useRef`", "`useLayoutEffect`", "`useId`"],
      answer: [0],
      explanation: "`const deferred = useDeferredValue(query)` gives the list a lagging value; React renders the urgent input first and catches the list up in the background (pair it with a memoized list).",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-suspense",
      level: "intermediate",
      prompt: "Is this component valid?",
      code: `function Message({ show, messagePromise }) {
  if (!show) return null;
  const message = use(messagePromise);
  return <p>{message}</p>;
}`,
      codeLang: "jsx",
      options: [
        "Yes: `use` may be called conditionally; it suspends until the promise resolves",
        "No: `use` follows the same rules as other hooks and can't follow an early return",
        "No: `use` only reads context",
        "Yes, but only in class components",
      ],
      answer: [0],
      explanation: "`use` is the one API you may call inside conditions and loops (still only in components and hooks). The promise should be created outside render, for example passed from a Server Component or a cache.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-actions",
      level: "intermediate",
      prompt: "With `useActionState`, what arguments does React pass to `addToCart` when the form is submitted?",
      code: `const [state, formAction, isPending] = useActionState(addToCart, null);

return (
  <form action={formAction}>
    <input name="qty" />
    <button>Add</button>
  </form>
);`,
      codeLang: "jsx",
      options: ["`(previousState, formData)`", "`(event)`", "`(formData)` only", "`(state, setState)`"],
      answer: [0],
      explanation: "The wrapped action receives the last state (here `null` at first) and the submitted `FormData`. Whatever it returns becomes the new `state`.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-actions",
      level: "intermediate",
      type: "order",
      prompt: "Put the steps of a `useActionState` form submission in order.",
      items: [
        "The user submits `<form action={formAction}>`",
        "`isPending` becomes true",
        "React calls the action with the previous state and the FormData",
        "The component re-renders with the returned value as `state` and `isPending` false",
      ],
      explanation: "React runs the Action in a transition: pending first, then the action, then one render with the result.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-actions",
      level: "junior",
      prompt: "In React 19, you write `<form action={save}>` with a function. What does `save` receive?",
      options: ["The form's `FormData`", "The submit event", "Nothing", "A ref to the form"],
      answer: [0],
      explanation: "Passing a function to `action` makes it a form Action: React calls it with `FormData` inside a transition, with no need for `preventDefault`.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-actions",
      level: "senior",
      prompt: "`saveLike()` fails, and the real `likes` value doesn't change. What does the button show once the Action has finished?",
      code: `const [optimisticLikes, addOptimistic] = useOptimistic(
  likes,
  (current, delta) => current + delta
);

async function likeAction() {
  addOptimistic(1);
  await saveLike();
}`,
      codeLang: "jsx",
      options: [
        "The original `likes` value: the optimistic value only lasts while the Action is pending",
        "`likes + 1` forever",
        "`likes + 2`, because the update re-applies",
        "An error message automatically",
      ],
      answer: [0],
      explanation: "useOptimistic shows the optimistic state during the Action. When it settles, React renders with the real `likes` passed in, so a failed save rolls back on its own.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-actions",
      level: "senior",
      type: "lines",
      prompt: "The Save button is never disabled while saving. Tap the buggy line.",
      code: `function NoteForm({ action }) {
  const { pending } = useFormStatus();
  return (
    <form action={action}>
      <input name="title" />
      <button disabled={pending}>Save</button>
    </form>
  );
}`,
      codeLang: "jsx",
      answer: [2],
      explanation: "`useFormStatus` reports on a parent `<form>`. Called in the component that renders the form, it has no parent form, so `pending` stays false. Move it into a `SubmitButton` rendered inside the form.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-actions",
      level: "junior",
      prompt: "In React 19, how does a function component receive a `ref` from its parent?",
      options: [
        "As a regular prop named `ref`; `forwardRef` is no longer needed",
        "Only through `forwardRef`",
        "Through `useContext`",
        "Function components can't receive refs",
      ],
      answer: [0],
      explanation: "React 19 passes `ref` as a prop to function components: `function Input({ ref, ...props }) { return <input ref={ref} {...props} /> }`.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-scale",
      level: "junior",
      prompt: "What does the React Compiler do?",
      options: [
        "At build time, it automatically memoizes components and values, reducing the need for manual memo, useMemo, and useCallback",
        "It compiles React to native mobile code",
        "It replaces JSX with HTML templates",
        "It moves components to the server",
      ],
      answer: [0],
      explanation: "The compiler analyses components and hooks and inserts memoization so only what changed re-renders. It assumes your code follows the Rules of React.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-scale",
      level: "staff",
      prompt:
        "A dashboard shows a cascade of spinners: the page fetches the user, then the sidebar fetches teams for that user, then each widget fetches its data. Load time is the sum of all requests. What's the architectural fix?",
      options: [
        "Remove the network waterfall: start independent requests in parallel and early (route-level loaders, a framework's server data fetching, or prefetching), and keep Suspense boundaries for loading UI",
        "Add more Suspense boundaries so spinners look nicer",
        "Move every fetch into one giant effect at the root",
        "Cache responses in localStorage",
      ],
      answer: [0],
      explanation: "Fetch-on-render in nested effects serialises requests. Fetching as early as possible and in parallel (render-as-you-fetch) is the documented fix; frameworks do it with route-level or server data loading.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-scale",
      level: "staff",
      prompt: "You're rolling out the React Compiler across a large codebase. Which two are sound strategies? (Choose two.)",
      options: [
        "Enable it incrementally, one directory or feature at a time, and verify behaviour",
        "Turn on the compiler-related React lint rules and fix Rules of React violations",
        "Delete every existing useMemo and useCallback before enabling it",
        "Disable Strict Mode so double renders don't interfere",
        "Wrap every component in memo as well, just in case",
      ],
      answer: [0, 1],
      explanation: "The compiler is safe on code that follows the Rules of React. Lint first, roll out gradually, and only remove manual memoization once you've confirmed nothing depended on it.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-scale",
      level: "staff",
      prompt: "A large app still has hundreds of class components. Leadership asks whether React 19 requires rewriting them as hooks. What do you advise?",
      options: [
        "No big-bang rewrite: class components still work. Write new code with function components and migrate classes when you touch them or when they block a feature",
        "Rewrite everything before upgrading; classes are removed in React 19",
        "Freeze the codebase until a full rewrite is done",
        "Wrap each class in a function component and call it migrated",
      ],
      answer: [0],
      explanation: "Classes and function components interoperate. Incremental migration reduces risk; prioritise code with bugs or that blocks hooks-based features.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-scale",
      level: "staff",
      prompt: "A crash in one dashboard widget blanks the entire page. What's the right structural fix?",
      options: [
        "Add error boundaries around each independent widget and route, with fallback UI and error reporting",
        "Wrap every component body in try/catch",
        "Add a `<Suspense>` boundary around each widget",
        "Catch errors in a global `window.onerror` and reload the page",
      ],
      answer: [0],
      explanation: "An uncaught render error unmounts the tree up to the nearest error boundary. Boundaries per widget contain the blast radius. (They don't catch errors in event handlers or async code; handle those where they happen.)",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-scale",
      level: "staff",
      prompt: "The initial JavaScript bundle is 2 MB. Where should you split code first?",
      options: [
        "At route boundaries and around heavy, rarely used widgets (editors, charts), with `lazy` + Suspense",
        "Split every component into its own chunk",
        "Inline everything into one file for fewer requests",
        "Lazy-load the header and navigation",
      ],
      answer: [0],
      explanation: "Routes and big optional features give large savings with few loading states. Splitting everything creates request waterfalls; lazy-loading what's always on screen just delays it.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-actions",
      level: "staff",
      prompt: "Your team wants `useOptimistic` everywhere. Which action is the worst fit for an optimistic update?",
      options: [
        "Submitting a payment",
        "Liking a post",
        "Adding a message to a chat thread",
        "Toggling a todo's done state",
      ],
      answer: [0],
      explanation: "Optimistic UI suits frequent, low-stakes, easily reversed actions. Showing \"Paid\" before the server confirms an irreversible, high-stakes operation misleads users; show pending state instead.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-scale",
      level: "senior",
      type: "lines",
      prompt: "The compiler's lint rules flag this component for breaking the Rules of React. Tap the line.",
      code: `let renderCount = 0;

function Badge({ user }) {
  renderCount++;
  return <span>{user.name} ({renderCount})</span>;
}`,
      codeLang: "jsx",
      answer: [4],
      explanation: "Mutating a variable outside the component during render makes it impure: the output depends on how many times React happened to call it (Strict Mode, concurrent renders). Keep render side-effect free.",
    },
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-actions",
      level: "intermediate",
      type: "match",
      prompt: "Match each React 19 / concurrent API to what it gives you.",
      pairs: [
        ["`useActionState`", "State returned by the last Action, plus a pending flag"],
        ["`useFormStatus`", "The pending status of the parent form"],
        ["`useOptimistic`", "A temporary value shown while an Action runs"],
        ["`use`", "The value of a promise or context, callable conditionally"],
        ["`useTransition`", "A way to mark updates as non-urgent, with isPending"],
      ],
      explanation: "Actions cover async mutations (state, form status, optimistic UI); `use` reads resources; transitions keep the UI responsive during heavy updates.",
    },
  ],

  cards: [
    { id: "c-d4-memo", domain: "d4", kind: "service", term: "memo", definition: "Wraps a component so it skips re-rendering when all props are `Object.is`-equal to last time." },
    { id: "c-d4-lazy", domain: "d4", kind: "service", term: "lazy", definition: "`lazy(() => import(\"./X\"))` loads a component's code on first render. Declare at module level; wrap in Suspense." },
    { id: "c-d4-suspense", domain: "d4", kind: "service", term: "Suspense", definition: "Shows a fallback while children suspend (lazy code, `use(promise)`, Suspense-enabled data)." },
    { id: "c-d4-usetransition", domain: "d4", kind: "service", term: "useTransition", definition: "Returns `[isPending, startTransition]`. Marks updates as non-urgent and interruptible." },
    { id: "c-d4-usedeferredvalue", domain: "d4", kind: "service", term: "useDeferredValue", definition: "Returns a lagging copy of a value so expensive renders don't block urgent input." },
    { id: "c-d4-use", domain: "d4", kind: "service", term: "use", definition: "Reads a promise (suspending until it resolves) or a context. Unlike other hooks, it can be called conditionally." },
    { id: "c-d4-useactionstate", domain: "d4", kind: "service", term: "useActionState", definition: "`[state, formAction, isPending] = useActionState(fn, initial)`; fn receives `(previousState, formData)`." },
    { id: "c-d4-useformstatus", domain: "d4", kind: "service", term: "useFormStatus", definition: "From react-dom. Returns `{ pending, data, method, action }` for the parent form; call it in a child of the form." },
    { id: "c-d4-useoptimistic", domain: "d4", kind: "service", term: "useOptimistic", definition: "Shows an optimistic value while an Action is pending, then reverts to the real state." },
    { id: "c-d4-compiler", domain: "d4", kind: "service", term: "React Compiler", definition: "Build-time tool that auto-memoizes components and hooks. Requires code that follows the Rules of React." },
    { id: "c-d4-profiler", domain: "d4", kind: "service", term: "React DevTools Profiler", definition: "Records renders, how long each took, and why a component rendered. Measure before optimising." },
    { id: "c-d4-portal", domain: "d4", kind: "service", term: "createPortal", definition: "From react-dom. Renders children into a different DOM node (modals, tooltips) while keeping them in the React tree." },
    { id: "c-d4-actions", domain: "d4", kind: "concept", term: "Action", definition: "An async function run in a transition. React tracks its pending state; forms accept them via `action`." },
    { id: "c-d4-optimistic", domain: "d4", kind: "concept", term: "Optimistic update", definition: "Show the expected result immediately, then reconcile with the server's answer. Best for low-stakes, reversible actions." },
    { id: "c-d4-boundary", domain: "d4", kind: "concept", term: "Error boundary", definition: "A class component (or library wrapper) that catches render errors below it and shows a fallback." },
    { id: "c-d4-virtual", domain: "d4", kind: "concept", term: "Virtualisation", definition: "Render only the rows visible in the viewport so huge lists stay fast." },
    { id: "c-d4-waterfall", domain: "d4", kind: "concept", term: "Request waterfall", definition: "Requests that start one after another because each waits for a parent to render. Fetch early and in parallel." },
    { id: "c-d4-colocation", domain: "d4", kind: "concept", term: "State colocation", definition: "Keep state in the lowest component that needs it, so updates re-render as little as possible." },
  ],

  challenges: [
    {
      id: "ch-react-isolate",
      domain: "d4",
      lesson: "d4-memo",
      title: "Only one re-render",
      goal: "Press +1 so that exactly one component re-renders.",
      hint: "Who owns `count`? Components outside the owner's subtree never re-render.",
      takeaway: "Moving state down to where it's used shrinks every update without any memoization.",
      render: (onSolved) => <RenderCounterLab goal="isolate" onSolved={onSolved} />,
    },
    {
      id: "ch-react-memo",
      domain: "d4",
      lesson: "d4-memo",
      title: "Make memo actually work",
      goal: "The count must stay in App. Press +1 so that only App and Counter re-render.",
      hint: "memo on Sidebar isn't enough while its style prop is a fresh object every render.",
      takeaway: "memo compares props with Object.is: it only helps when objects and functions you pass are stable.",
      render: (onSolved) => <RenderCounterLab goal="memo" onSolved={onSolved} />,
    },
  ],
});
