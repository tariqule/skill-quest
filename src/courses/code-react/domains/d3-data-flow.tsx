import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/** Domain 3: forms, lifting state, context, and effects you might not need. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Data Flow and Forms",
    world: "Prop River Delta",
    weight: 20,
    emoji: "🏞️",
    color: "#34d399",
    summary: "How data moves through an app: form inputs, sharing state between components, context for data many components need, and when you can drop an effect.",
  },

  tasks: [
    { id: "3.1", title: "Build forms with controlled and uncontrolled inputs", covers: ["value + onChange", "defaultValue + refs or FormData", "component APIs that support both"] },
    { id: "3.2", title: "Share state by lifting it up or with context", covers: ["closest common parent", "inverse data flow with callbacks", "createContext / useContext", "context performance"] },
    { id: "3.3", title: "Remove effects you don't need", covers: ["derived values", "events vs effects", "redundant state", "URL as state"] },
  ],

  lessons: [
    {
      id: "d3-b-props",
      level: "beginner",
      task: "3.2",
      title: "Props: passing data down",
      check: ["react-b3-01", "react-b3-02"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🏠", label: "Parent", sub: "Has the data" },
              { icon: "📨", label: "Props", sub: "label=\"Sale\"" },
              { icon: "🏷️", label: "Child", sub: "Shows what it was given" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            caption="One component, two results, because each copy gets different props."
            code={`function Badge({ label }) {
  return <span className="badge">{label}</span>;
}

<Badge label="New" />
<Badge label="Sale" />`}
          />
        </div>
      ),
      points: [
        "**Props** are the inputs you give a component. You write them like HTML attributes: `<Badge label=\"New\" />`.",
        "It's like ordering a coffee. You say \"large, with oat milk\", and the barista makes exactly that. The component reads its props and shows the right thing.",
        "Data flows one way, from a parent component down to its children. A child reads its props but doesn't change them.",
        "The same component with different props gives different results, so one `Badge` can say \"New\" or \"Sale\".",
      ],
      tip: "When a child needs to tell its parent something, the parent passes down a function as a prop and the child calls it. You'll see this with `onClick` all the time.",
    },
    {
      id: "d3-b-forms",
      level: "beginner",
      task: "3.1",
      title: "Reading what the user types",
      check: ["react-b3-03", "react-b3-04"],
      visual: (
        <CodeBlock
          lang="jsx"
          caption="Each key press saves the new text in state, and the greeting updates as you type."
          code={`function NameBox() {
  const [name, setName] = useState("");
  return (
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Hello, {name}</p>
    </>
  );
}`}
        />
      ),
      points: [
        "Forms are how users give your app information: a name, a search term, a message.",
        "A common React pattern keeps what the user types in state. Each time they type, `onChange` runs and saves the new text.",
        "`e` is the event object React hands to your function, and `e.target.value` is the text in the box right now.",
        "Because the text lives in state, the rest of the component can use it straight away, like showing \"Hello, Sam\" while you type.",
      ],
      tip: "Start text state as an empty string, `useState(\"\")`. That gives the input a real value from the very first render.",
    },
    {
      id: "d3-forms",
      level: "junior",
      task: "3.1",
      title: "Controlled vs uncontrolled inputs",
      check: ["d3-02", "d3-03"],
      visual: (
        <CodeCompare
          lang="jsx"
          left={{
            title: "Uncontrolled: the DOM owns the value",
            code: `function Signup() {
  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.target);
    save(data.get("email"));
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name="email" defaultValue="" />
      <button>Join</button>
    </form>
  );
}`,
          }}
          right={{
            title: "Controlled: React state owns the value",
            code: `function Signup() {
  const [email, setEmail] = useState("");
  const valid = email.includes("@");
  return (
    <form onSubmit={(e) => {
      e.preventDefault(); save(email);
    }}>
      <input value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <button disabled={!valid}>Join</button>
    </form>
  );
}`,
          }}
        />
      ),
      points: [
        "In a **controlled** input, `value` comes from state and every key press goes through `onChange`. Use it when you need the value as the user types, for live checks or formatting.",
        "In an **uncontrolled** input, the browser keeps the value. You set `defaultValue` and read the value when you need it, with a ref or `FormData`. It's less code and fewer renders.",
        "Setting `value` without `onChange` makes the input read-only. Setting `value={undefined}` makes it uncontrolled. Start text state at `\"\"`, not `undefined`.",
        "Reusable input components often support both styles, just like the browser's own inputs: `value` with `onChange`, or `defaultValue`.",
      ],
      tip: "When asked which to use, don't say \"always controlled\". Say what each costs. Controlled gives you the value on every key press. Uncontrolled avoids re-renders and is enough when you only need the value on submit.",
    },
    {
      id: "d3-lifting",
      level: "junior",
      task: "3.2",
      title: "Lifting state up",
      check: ["d3-07", "d3-09"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🔼", label: "Find the common parent", sub: "The closest component above everyone who needs the value" },
              { icon: "🧠", label: "Put state there", sub: "One source of truth" },
              { icon: "⬇️", label: "Pass the value down", sub: "As props" },
              { icon: "⬆️", label: "Pass a callback down", sub: "Children ask the parent to change it" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            code={`function Accordion() {
  const [openId, setOpenId] = useState(null);
  return panels.map((p) => (
    <Panel key={p.id} title={p.title}
      isOpen={openId === p.id}
      onShow={() => setOpenId(p.id)} />
  ));
}`}
          />
        </div>
      ),
      points: [
        "When two sibling components need the same data, move the state up to their closest shared parent and pass it down to both. This is called **lifting state up**.",
        "Children change that shared state by calling a function the parent passed down as a prop.",
        "Keep one source of truth. Don't copy a prop into state, because the copy won't update when the prop changes.",
        "Write `onClick={() => onDelete(id)}`, not `onClick={onDelete(id)}`. The second one calls `onDelete` immediately, while rendering, instead of on click.",
      ],
      tip: "Talk through the \"Thinking in React\" steps from the docs. Find the smallest set of state you need, then ask which component should own it, before you write any code.",
    },
    {
      id: "d3-context",
      level: "intermediate",
      task: "3.2",
      title: "Context: passing data deeply",
      check: ["d3-12", "d3-13"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="jsx"
            caption="In React 19 the context itself is the provider. Older code writes <ThemeContext.Provider value=…>."
            code={`const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext value={theme}>
      <Page />   {/* any depth below can read it */}
    </ThemeContext>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>OK</button>;
}`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧭", title: "Nearest provider wins", text: "useContext reads the closest provider above; with none, the default from createContext.", color: "#34d399" },
              { icon: "🔔", title: "Consumers re-render", text: "When the value changes (Object.is), every reader re-renders, even inside memo.", color: "#f59e0b" },
              { icon: "✂️", title: "Split hot values", text: "Separate contexts for things that change at different rates, and keep the value stable.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "**Prop drilling** is passing a prop through many layers that don't use it. **Context** avoids that for data lots of components need, like the theme, the signed-in user or the language.",
        "Try plain props, or passing components as `children`, first. Context makes it harder to see where data comes from.",
        "Writing `value={{ user, setUser }}` makes a new object every time the provider renders, so every reader re-renders. Wrap it in `useMemo`, or let the React Compiler do that.",
      ],
      tip: "Asked about context versus a state library? Context only carries a value down the tree. It has no way to pick out one field, so every component reading it re-renders on every change.",
    },
    {
      id: "d3-no-effect",
      level: "senior",
      task: "3.3",
      title: "You might not need an effect",
      sources: [{ title: "react.dev: You Might Not Need an Effect", url: "https://react.dev/learn/you-might-not-need-an-effect", license: "CC BY 4.0" }],
      check: ["d3-17", "d3-18"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="jsx"
            left={{
              title: "Effect + extra state: two renders",
              code: `const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(first + " " + last);
}, [first, last]);`,
            }}
            right={{
              title: "Compute during render",
              code: `const fullName = first + " " + last;
// expensive? memoize it:
const sorted = useMemo(
  () => sortBy(items, key), [items, key]);`,
            }}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🖱️", title: "Caused by an interaction?", text: "Put it in the event handler: POST on submit, toast on click.", color: "#38bdf8" },
              { icon: "📺", title: "Caused by being on screen?", text: "That's an effect: connect to a server, subscribe, sync a widget.", color: "#34d399" },
              { icon: "🔑", title: "Reset on prop change?", text: "Give the component a `key` instead of an effect that clears state.", color: "#f59e0b" },
              { icon: "🔗", title: "Shareable UI state?", text: "Filters, tabs, page: keep them in the URL and derive the UI from it.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "If you can work a value out from props or state, do it while rendering. Don't store it in its own state and keep it in sync with an effect.",
        "An effect that sets state causes a second render, and for a moment the screen shows the old value.",
        "Code that runs because the user did something, like clicking Buy, belongs in that click's event handler.",
        "Think of effects as an escape hatch, for syncing with things outside React.",
        "If a value can be computed from props or state, it's **derived** data: calculate it during render instead of storing it in state and syncing it with an effect.",
      ],
      tip: "Interviewers often show a component full of effects and ask you to clean it up. Start by deleting state you can work out from other state. Most of the effects go with it.",
    },
  ],

  questions: [
    {
      id: "react-b3-01",
      domain: "d3",
      lesson: "d3-b-props",
      level: "beginner",
      prompt: "What does this show on the page?",
      code: `function Hello({ name }) {
  return <p>Hi, {name}!</p>;
}

<Hello name="Sam" />`,
      codeLang: "jsx",
      options: ["Hi, Sam!", "Hi, name!", "Hi, {name}!", "Nothing, because props need a database"],
      answer: [0],
      explanation: "`name` is a prop. The parent wrote `name=\"Sam\"`, so inside the component `name` holds \"Sam\" and the paragraph reads Hi, Sam!",
    },
    {
      id: "react-b3-02",
      domain: "d3",
      lesson: "d3-b-props",
      level: "beginner",
      prompt: "Which way do props flow in React?",
      options: ["From a parent component down to its children", "From a child up to its parent", "Sideways between any two of the components"],
      answer: [0],
      explanation: "Props always flow down. A parent decides what to pass and the child uses it. To send information back up, the parent gives the child a function to call.",
    },
    {
      id: "react-b3-03",
      domain: "d3",
      lesson: "d3-b-forms",
      level: "beginner",
      prompt: "In `onChange={(e) => setName(e.target.value)}`, what is `e.target.value`?",
      options: ["The text that's in the input box right now", "The name of the component", "How many times the user clicked", "A default value sent from the server"],
      answer: [0],
      explanation: "`e` is the change event and `e.target` is the input that changed. Its `value` is the current text in the box, which you then save into state.",
    },
    {
      id: "react-b3-04",
      type: "fill",
      domain: "d3",
      lesson: "d3-b-forms",
      level: "beginner",
      prompt: "Fill the gap so the text the user types is saved into state.",
      code: `const [name, setName] = useState("");

<input value={name} {{1}}={(e) => setName(e.target.value)} />`,
      codeLang: "jsx",
      blanks: [{ options: ["onChange", "onClick", "onType", "value"], answer: 0 }],
      explanation: "`onChange` runs every time the text in the box changes. That's the moment you want to save the new text with `setName`.",
    },
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-forms",
      level: "junior",
      prompt: "What makes an input \"controlled\"?",
      options: [
        "Its `value` comes from React state and changes go through `onChange`",
        "It has a `ref` attached",
        "It uses `defaultValue`",
        "It lives inside a `<form>` element that has its own `onSubmit` handler",
      ],
      answer: [0],
      explanation: "React state is the single source of truth: the input shows `value` and reports edits through `onChange`, which updates the state.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-forms",
      level: "junior",
      type: "lines",
      prompt: "Typing into the field does nothing. Tap the buggy line.",
      code: `function Search() {
  const [q, setQ] = useState("");
  return (
    <form>
      <input value={q} />
      <p>Searching for {q}</p>
    </form>
  );
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "An input with `value` but no `onChange` is read-only: React keeps resetting it to `q`. Add `onChange={(e) => setQ(e.target.value)}`.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-forms",
      level: "junior",
      prompt: "The user changes the field to \"me@x.io\" and submits. What is logged?",
      code: `function Signup() {
  const emailRef = useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(emailRef.current.value);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} defaultValue="a@b.co" />
      <button>Join</button>
    </form>
  );
}`,
      codeLang: "jsx",
      options: ["me@x.io", "a@b.co", "undefined", "null"],
      answer: [0],
      explanation: "This is an uncontrolled input: `defaultValue` only sets the starting value, and the DOM holds what the user typed. The ref reads the live DOM value.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-forms",
      level: "intermediate",
      prompt: "Which requirements push you toward a controlled input? (Choose two.)",
      options: [
        "Show a live character count as the user types",
        "Disable Submit until the email looks valid",
        "Read the value once when the form is submitted",
        "Avoid re-rendering on every keystroke",
        "Let the browser remember the value with no React state",
      ],
      answer: [0, 1],
      explanation: "Anything that reacts to each keystroke needs the value in state. If you only need it on submit, an uncontrolled input with `FormData` is simpler.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-forms",
      level: "intermediate",
      prompt: "Typing into this input logs \"A component is changing an uncontrolled input to be controlled\". What's the fix?",
      code: `const [name, setName] = useState();
return <input value={name} onChange={(e) => setName(e.target.value)} />;`,
      codeLang: "jsx",
      options: ["Start the state with an empty string: `useState(\"\")`", "Add `defaultValue={name}`", "Use `onInput` instead of `onChange` on the input", "Wrap the input in `memo`"],
      answer: [0],
      explanation: "`value={undefined}` means uncontrolled. After the first key press it becomes a string, and the input switches modes. Keep it controlled from the start with `\"\"`.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-lifting",
      level: "junior",
      type: "lines",
      prompt: "Every item deletes itself as soon as the list renders. Tap the buggy line.",
      code: `function Item({ id, onDelete }) {
  return (
    <li>
      Item {id}
      <button onClick={onDelete(id)}>Delete</button>
    </li>
  );
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "`onDelete(id)` is called during render and its return value becomes the handler. Pass a function instead: `onClick={() => onDelete(id)}`.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-lifting",
      level: "junior",
      prompt: "Two sibling components must show and edit the same value. Where should its state live?",
      options: [
        "In their closest common parent, passed down as a prop plus a setter callback",
        "In both siblings, each with its own copy of the value, kept in sync with effects",
        "In a ref in one sibling",
        "In a global variable",
      ],
      answer: [0],
      explanation: "Lift the state to the nearest common ancestor so there's a single source of truth. Syncing two copies with effects is fragile.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-lifting",
      level: "intermediate",
      prompt: "`Add` is clicked twice. What does the paragraph show?",
      code: `function Parent() {
  const [total, setTotal] = useState(0);
  return (
    <>
      <Adder onAdd={(n) => setTotal((t) => t + n)} />
      <p>{total}</p>
    </>
  );
}
function Adder({ onAdd }) {
  return <button onClick={() => { onAdd(2); onAdd(3); }}>Add</button>;
}`,
      codeLang: "jsx",
      options: ["10", "5", "3", "16"],
      answer: [0],
      explanation: "Each click queues two updater functions, one adding 2 and one adding 3, so every click adds 5. Two clicks take it from 0 to 5 to 10. The child changes the parent's state through the function it got as a prop.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-lifting",
      level: "junior",
      type: "order",
      prompt: "Put the steps of lifting state up in order.",
      items: [
        "Remove the state from the child components",
        "Add the state to their closest common parent",
        "Pass the value down to the children as a prop",
        "Pass a callback down so the children can request changes",
      ],
      explanation: "Move the state up to the shared parent. Then pass the data down as props, and pass functions down so children can report events back up.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-lifting",
      level: "intermediate",
      type: "lines",
      prompt: "The parent passes a different `user`, but the heading keeps showing the old name. Tap the buggy line.",
      code: `function Avatar({ user }) {
  const [name, setName] = useState(user.name);
  return <h2>{name}</h2>;
}`,
      codeLang: "jsx",
      answer: [2],
      explanation: "The initial state is only used on the first render, so copying a prop into state freezes it. Read `user.name` directly (or reset with a `key` if you really need editable local state).",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-context",
      level: "junior",
      prompt: "What problem does context mainly solve?",
      options: [
        "Prop drilling: passing the same data through many layers that don't use it",
        "Making components render faster by caching the values they read from props",
        "Fetching data from the server",
        "Replacing all local state",
      ],
      answer: [0],
      explanation: "Context lets any component below a provider read a value directly. It's a way to carry data, not a speed-up and not a full state manager.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-context",
      level: "intermediate",
      prompt: "What does `App` render?",
      code: `const ThemeContext = createContext("light");

function Label() {
  const theme = useContext(ThemeContext);
  return <span>{theme} </span>;
}

function App() {
  return (
    <>
      <ThemeContext value="dark">
        <Label />
      </ThemeContext>
      <Label />
    </>
  );
}`,
      codeLang: "jsx",
      options: ["dark light", "dark dark", "light light", "light dark"],
      answer: [0],
      explanation: "The first `Label` reads the nearest provider (\"dark\"). The second has no provider above it, so it gets the default passed to `createContext` (\"light\"). In React 19 you render the context itself as the provider.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-context",
      level: "senior",
      prompt: "A component wrapped in `memo` calls `useContext(ThemeContext)`. Its props don't change, but the theme does. Does it re-render?",
      options: [
        "Yes: a context change re-renders every component that reads it, memo or not",
        "No: memo blocks all re-renders whenever the component's props are equal",
        "Only if it's a direct child of the provider",
        "Only in development",
      ],
      answer: [0],
      explanation: "`memo` only compares props. A component that reads a context is signed up for its changes, so a new context value re-renders it anyway.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-context",
      level: "senior",
      type: "lines",
      prompt: "Toggling the theme re-renders every component that reads AuthContext, even though `user` didn't change. Tap the line responsible.",
      code: `function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  return (
    <AuthContext value={{ user, setUser }}>
      <ThemeToggle theme={theme} onToggle={setTheme} />
      {children}
    </AuthContext>
  );
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "`{ user, setUser }` is a new object on every render of AuthProvider, so every consumer sees a changed value. Memoize it: `useMemo(() => ({ user, setUser }), [user])`, or move unrelated state out of the provider.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-context",
      level: "staff",
      prompt:
        "A large app keeps user, theme, cart, modal flags, and form drafts in one context object. Typing in any form re-renders hundreds of components. What's the best restructuring?",
      options: [
        "Keep form drafts as local state, give rarely changing values (user, theme) their own contexts, and move hot shared state to a store with selector subscriptions",
        "Wrap every consumer in `memo`",
        "Put the whole context value in a ref so it never triggers renders",
        "Add more fields to the same context so components can pick what they need, and wrap every consumer in `memo` so changes to unrelated fields don't re-render them",
      ],
      answer: [0],
      explanation: "Context has no selectors: any change re-renders every consumer. Split by concern and update frequency, colocate truly local state, and use a store (via `useSyncExternalStore`-based libraries) for frequently changing shared state.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-forms",
      level: "staff",
      prompt:
        "You're designing a `<DatePicker>` for 30 teams. Some need to control the selected date from their own state; others just want a starting date. What API do you ship?",
      options: [
        "Support both modes like native inputs: `value` + `onChange` (controlled) or `defaultValue` (uncontrolled), and don't let a component switch modes during its lifetime",
        "Controlled only; teams must always manage the state",
        "Uncontrolled only, with a ref for reading the date",
        "Sync an internal state copy from the `value` prop with an effect, so the component accepts a prop but also keeps its own state, and let callers switch between the two styles whenever they like",
      ],
      answer: [0],
      explanation: "Mirroring the native input contract is predictable and flexible. Copying `value` into internal state with an effect creates two sources of truth and an extra render.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "intermediate",
      prompt: "What's the best refactor of this component?",
      code: `function Cart({ items }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((s, i) => s + i.price, 0));
  }, [items]);
  return <p>Total: {total}</p>;
}`,
      codeLang: "jsx",
      options: [
        "Delete the state and effect; compute `const total = items.reduce(…)` during render",
        "Switch to `useLayoutEffect` so the total updates before the paint and there's no flicker",
        "Add `total` to the dependency array",
        "Store `total` in a ref",
      ],
      answer: [0],
      explanation: "`total` is derived from props. Computing it in render removes a state variable, an effect, and an extra render with a stale value. Add `useMemo` only if it's measurably expensive.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "senior",
      prompt: "Where should the purchase request live?",
      code: `function BuyButton({ product }) {
  const [bought, setBought] = useState(false);
  useEffect(() => {
    if (bought) {
      post("/api/buy", { id: product.id });
      showToast("Added to cart");
    }
  }, [bought, product.id]);
  return <button onClick={() => setBought(true)}>Buy</button>;
}`,
      codeLang: "jsx",
      options: [
        "In the click handler, because it happens in response to a specific user action",
        "In this effect, but with an empty dependency array instead of `[clicked]`",
        "In a `useMemo`",
        "During render, guarded by `if (bought)`",
      ],
      answer: [0],
      explanation: "The request is caused by the click, not by the component being on screen. As an effect it can fire again unexpectedly (for example when `product.id` changes while `bought` is true). Put the POST and toast in `onClick`.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "intermediate",
      prompt: "Which of these genuinely need an effect? (Choose two.)",
      options: [
        "Connecting to a chat server while the component is on screen",
        "Initialising a non-React map widget on a DOM node after render",
        "Filtering a list from props for display",
        "Sending a POST when the user clicks Submit",
        "Resetting all state when the `userId` prop changes",
      ],
      answer: [0, 1],
      explanation: "Effects are for syncing with outside systems. Filtering a list is something you do while rendering, a submit belongs in its event handler, and a reset is easiest with a `key`.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "senior",
      prompt: "On the first render, what does `fullName` hold, and what's the problem?",
      code: `const [first, setFirst] = useState("Ada");
const [last, setLast] = useState("Lovelace");
const [fullName, setFullName] = useState("");
useEffect(() => {
  setFullName(first + " " + last);
}, [first, last]);`,
      codeLang: "jsx",
      options: [
        "An empty string; React then renders again with \"Ada Lovelace\". Redundant state costs an extra render and briefly shows a stale value",
        "\"Ada Lovelace\"; there's no problem",
        "undefined; the effect throws",
        "\"Ada Lovelace\", but it renders in an infinite loop, since setting state in an effect always triggers another render and another effect run",
      ],
      answer: [0],
      explanation: "The effect runs after the first commit, so the first paint (or commit) has `\"\"`. Compute `const fullName = first + \" \" + last` during render instead.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-lifting",
      level: "intermediate",
      type: "order",
      prompt: "Put the \"Thinking in React\" steps in order.",
      items: [
        "Break the UI into a component hierarchy",
        "Build a static version with props only",
        "Find the minimal but complete set of state",
        "Decide which component should own each piece of state",
        "Add inverse data flow with callbacks",
      ],
      explanation: "This is the process from the React docs. Break the UI into components, build a static version, find the smallest state you need, decide who owns it, then wire events back up.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "staff",
      prompt: "A product list has search, sort, and page controls, and users want to share and bookmark filtered views. Where should that state live?",
      options: [
        "In the URL's search params as the source of truth, with the UI derived from them",
        "In component state, copied over to the URL's query string by an effect",
        "In localStorage",
        "In a context at the app root",
      ],
      answer: [0],
      explanation: "If state must survive reloads, back/forward, and sharing, the URL is the natural owner. Reading it directly avoids two sources of truth that need syncing.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-no-effect",
      level: "staff",
      prompt:
        "In code review, a teammate stores `filteredList`, `fullName`, and `isValid` in state \"for performance\" and keeps them in sync with effects. What guidance do you give?",
      options: [
        "Compute derived values during render; add `useMemo` only for calculations a profile shows are expensive",
        "Good practice: state is always faster than recomputing, so derived values belong in `useState` kept in sync by an effect",
        "Move them all into refs",
        "Keep the state, but switch to `useLayoutEffect`",
      ],
      answer: [0],
      explanation: "Extra state that copies other state adds renders and sync bugs. Most calculations are cheap. Memoize the few that aren't, once you've measured them.",
    },
  ],

  cards: [
    { id: "c-d3-controlled", domain: "d3", kind: "concept", term: "Controlled input", definition: "The value comes from React state through `value`, and every edit goes through `onChange`." },
    { id: "c-d3-uncontrolled", domain: "d3", kind: "concept", term: "Uncontrolled input", definition: "The browser keeps the value. You set `defaultValue`, then read it with a ref or `FormData` when you need it." },
    { id: "c-d3-lifting", domain: "d3", kind: "concept", term: "Lifting state up", definition: "Move shared state up to the closest shared parent, then pass the value and the functions that change it down as props." },
    { id: "c-d3-inverse", domain: "d3", kind: "concept", term: "Inverse data flow", definition: "Children update parent-owned state by calling callback props." },
    { id: "c-d3-drilling", domain: "d3", kind: "concept", term: "Prop drilling", definition: "Passing a prop through many layers that don't use it, just to reach a deep child. Context or composition fixes it." },
    { id: "c-d3-derived", domain: "d3", kind: "concept", term: "Derived state", definition: "A value computable from props or state. Compute it during render instead of storing and syncing it." },
    { id: "c-d3-source", domain: "d3", kind: "concept", term: "Single source of truth", definition: "Each piece of state has one owner, and everything else reads from it." },
    { id: "c-d3-createcontext", domain: "d3", kind: "service", term: "createContext", definition: "Creates a context with a default value. In React 19, render `<MyContext value={…}>` as the provider." },
    { id: "c-d3-usecontext", domain: "d3", kind: "service", term: "useContext", definition: "Reads the nearest provider's value and re-renders the component when it changes." },
    { id: "c-d3-formdata", domain: "d3", kind: "service", term: "FormData", definition: "Browser API that reads every named field of a form; React form Actions receive one." },
  ],
});
