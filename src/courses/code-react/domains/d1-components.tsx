import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { KeysVisual } from "../visuals";

/** Domain 1: components, JSX, props vs state, rendering, keys and reconciliation. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Components and Rendering",
    world: "The JSX Jungle",
    weight: 25,
    emoji: "🌿",
    color: "#61dafb",
    summary: "How components and JSX work, the difference between props and state, what happens during a render, and how keys help React match list items.",
  },

  tasks: [
    { id: "1.1", title: "Write components with JSX", covers: ["function components", "JSX expressions, attributes, and fragments", "conditional rendering and lists", "purity"] },
    { id: "1.2", title: "Explain props, state, and re-rendering", covers: ["props vs state", "trigger → render → commit", "state as a snapshot", "what makes a component re-render"] },
    { id: "1.3", title: "Use keys and understand reconciliation", covers: ["stable keys", "state is tied to position in the tree", "resetting state with `key`"] },
  ],

  lessons: [
    {
      id: "d1-b-what",
      level: "beginner",
      task: "1.1",
      title: "What React is, and why people use it",
      check: ["react-b1-01", "react-b1-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🧱", title: "Components", text: "Small, reusable pieces of a page, like a button or a menu. You build big screens out of them.", color: "#61dafb" },
            { icon: "📝", title: "Describe it", text: "You say what the screen should look like. React works out how to change the page.", color: "#a78bfa" },
            { icon: "🔁", title: "Stay in sync", text: "When your data changes, React updates only the parts of the page that need it.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "**React** is a JavaScript library for building user interfaces: the parts of an app that people see and click.",
        "You build a page from **components**. A component is one reusable piece of the screen, like a button, a search box or a product card.",
        "Think of LEGO bricks. You make a few small bricks, then snap them together into bigger things. One `ProductCard` can appear a hundred times on a page.",
        "When your data changes, you don't edit the page by hand. React compares the new screen with the old one and updates only what changed.",
      ],
      tip: "If you know a little HTML and JavaScript, you already know most of what React builds on. React adds a way to split the page into components and keep it in step with your data.",
    },
    {
      id: "d1-b-first",
      level: "beginner",
      task: "1.1",
      title: "Your first component",
      check: ["react-b1-03", "react-b1-04"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#61dafb"
            steps={[
              { icon: "✍️", label: "Write a function", sub: "Give it a capitalised name" },
              { icon: "🧾", label: "Return JSX", sub: "HTML-like markup for the screen" },
              { icon: "🏷️", label: "Use it as a tag", sub: "<Hello /> shows it on the page" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            caption="A whole component. It's a function that returns what should appear on screen."
            code={`function Hello() {
  return <h1>Hello, world!</h1>;
}

// Use it like an HTML tag:
<Hello />`}
          />
        </div>
      ),
      points: [
        "A component is a plain JavaScript function. Its name starts with a capital letter, like `Hello` or `ProductCard`.",
        "The function returns **JSX**, which looks like HTML but lives inside your JavaScript. `<h1>Hello</h1>` is JSX.",
        "To show a component, write its name as a tag: `<Hello />`. The slash closes the tag, because there's nothing inside it.",
        "Curly braces let you put JavaScript inside JSX. `<p>{2 + 2}</p>` shows 4 on the page.",
      ],
      tip: "Keep your first components tiny. One that shows a single heading is a fine start, and you'll combine them into bigger ones later.",
    },
    {
      id: "d1-jsx",
      level: "junior",
      task: "1.1",
      title: "Components are functions that return JSX",
      check: ["d1-01", "d1-21"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="jsx"
            left={{
              title: "You write JSX",
              code: `function Welcome({ name }) {
  return (
    <>
      <h1 className="title">Hi, {name}!</h1>
      {name === "Ada" && <p>Welcome back</p>}
    </>
  );
}`,
            }}
            right={{
              title: "The compiler emits function calls",
              code: `function Welcome({ name }) {
  return jsxs(Fragment, {
    children: [
      jsx("h1", { className: "title",
        children: ["Hi, ", name, "!"] }),
      name === "Ada" && jsx("p", {
        children: "Welcome back" }),
    ],
  });
}`,
            }}
          />
          <CodeBlock
            lang="jsx"
            caption="Lists: map data to elements and give each one a stable key."
            code={`<ul>
  {users.map((u) => <li key={u.id}>{u.name}</li>)}
</ul>`}
          />
        </div>
      ),
      points: [
        "A component is a JavaScript function whose name starts with a capital letter and returns JSX.",
        "JSX turns into plain function calls, so curly braces `{}` can hold any JavaScript expression. You write `className` instead of `class`, and `htmlFor` instead of `for`.",
        "A component returns one root element. To return several side by side, wrap them in a **Fragment**, `<>…</>`, which groups them without adding an extra element to the page.",
        "Components must be **pure**: give them the same props and state and they return the same JSX. They don't change anything outside themselves while rendering.",
      ],
      tip: "Interviewers like asking why components need capital letters. The answer: lowercase tags are treated as built-in HTML elements, and capitalised ones point to your own components.",
    },
    {
      id: "d1-props-state",
      level: "junior",
      task: "1.2",
      title: "Props vs state",
      check: ["d1-05", "d1-07"],
      visual: (
        <div className="grid gap-3">
          <Tiles
            tiles={[
              { icon: "📦", title: "Props", text: "Inputs passed by the parent, like function arguments. Read-only inside the child.", color: "#61dafb" },
              { icon: "🧠", title: "State", text: "A component's own memory between renders. Changed only through its setter, which triggers a re-render.", color: "#a78bfa" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            caption="A plain variable resets on every render and never triggers one. State survives and triggers."
            code={`function Counter({ step }) {          // step: a prop
  const [count, setCount] = useState(0); // count: state
  return (
    <button onClick={() => setCount(count + step)}>
      {count}
    </button>
  );
}`}
          />
        </div>
      ),
      points: [
        "Data flows down. A parent passes props to its children, and a child asks for changes by calling a function it got as a prop.",
        "Never change props inside a child. Treat them like a photo you were handed: you can look, but you don't draw on it.",
        "Plain variables inside a component start fresh on every render. They can't remember anything, and changing one doesn't update the screen. That's what state is for.",
      ],
      tip: "A line that works well in interviews: \"Props are settings from outside. State is memory from inside.\"",
    },
    {
      id: "d1-rerender",
      level: "intermediate",
      task: "1.2",
      title: "Trigger, render, commit",
      check: ["d1-08", "d1-11"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#61dafb"
            steps={[
              { icon: "🔔", label: "Trigger", sub: "Initial mount, or a state setter is called" },
              { icon: "🧮", label: "Render", sub: "React calls your component (and its children) to get new JSX" },
              { icon: "🔍", label: "Diff", sub: "Compare with the previous output" },
              { icon: "✍️", label: "Commit", sub: "Apply only the DOM changes that are needed" },
            ]}
          />
          <CodeBlock
            lang="jsx"
            caption="State is a snapshot: during one render, `count` is a constant. Updates are batched and applied on the next render."
            code={`function handleClick() {
  setCount(count + 1); // count is 0 in this render
  setCount(count + 1); // still 0
  console.log(count);  // 0
}                       // next render: count is 1`}
          />
        </div>
      ),
      points: [
        "A component re-renders when its state changes, when its parent re-renders, or when a context it reads changes.",
        "Rendering means React calls your function. It doesn't mean the page changes. React only applies the differences, and that step is called the **commit**.",
        "Since React 18, several state updates in one event handler, timeout or promise are **batched**: React groups them and renders once.",
        "Setting state to the same value (by `Object.is`) lets React skip re-rendering that component's children.",
      ],
      tip: "When asked what a render is, separate the two steps. Rendering is calling your components. Committing is touching the page. It shows you know why extra renders are usually cheap.",
    },
    {
      id: "d1-keys",
      level: "intermediate",
      task: "1.3",
      title: "Keys and reconciliation",
      check: ["d1-13", "d1-16"],
      visual: <KeysVisual />,
      points: [
        "A **key** tells React which list item is which between renders. Use an id that comes with your data and never changes.",
        "Using the array index as the key is fine only for lists that never get reordered, added to or trimmed.",
        "State belongs to a spot in the component tree. The same component type in the same spot keeps its state. A different type, or a different key, starts it fresh.",
        "You can change a component's `key` on purpose to reset its state. For example, `<Profile key={userId} />` starts over whenever the user changes.",
        "Don't define a component inside another component. It becomes a brand-new type on every render, so React throws it away and builds it again each time.",
      ],
      tip: "If you're asked why `Math.random()` keys are bad: every render makes new keys, so React rebuilds every item from scratch. Typed text and focus are lost.",
    },
  ],

  questions: [
    {
      id: "react-b1-01",
      domain: "d1",
      lesson: "d1-b-what",
      level: "beginner",
      prompt: "What is React mainly used for?",
      options: ["Building user interfaces out of reusable components", "Storing data in a database", "Styling pages instead of CSS", "Running a web server"],
      answer: [0],
      explanation: "React is a JavaScript library for building the parts of an app that people see and use. It doesn't store data or replace CSS. You split the screen into components and React keeps them up to date.",
    },
    {
      id: "react-b1-02",
      domain: "d1",
      lesson: "d1-b-what",
      level: "beginner",
      prompt: "In React, what is a component?",
      options: ["One reusable piece of the user interface, like a button or a card", "A file that holds only your CSS", "A kind of database table", "A browser plugin you install"],
      answer: [0],
      explanation: "A component is a building block of the screen. You write it once and use it as often as you like, the way you'd reuse the same LEGO brick in many places.",
    },
    {
      id: "react-b1-03",
      domain: "d1",
      lesson: "d1-b-first",
      level: "beginner",
      prompt: "What does this component show on the page?",
      code: `function Total() {
  return <p>Total: {3 + 4}</p>;
}`,
      codeLang: "jsx",
      options: ["Total: 7", "Total: {3 + 4}", "Total: 3 + 4", "Nothing, because JSX can't do maths"],
      answer: [0],
      explanation: "Curly braces in JSX mean \"run this JavaScript and show the result\". So `{3 + 4}` becomes 7, and the paragraph reads Total: 7.",
    },
    {
      id: "react-b1-04",
      domain: "d1",
      lesson: "d1-b-first",
      level: "beginner",
      prompt: "Which name works for a React component?",
      options: ["`ProductCard`", "`productCard`", "`product_card`"],
      answer: [0],
      explanation: "Component names start with a capital letter. React treats lowercase tags like `<div>` as plain HTML, so the capital letter is how it knows `<ProductCard />` is one of your components.",
    },
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      prompt: "What does this render?",
      code: `function Greeting({ name }) {
  return <h1>Hello, {name.toUpperCase()}!</h1>;
}

<Greeting name="ada" />`,
      codeLang: "jsx",
      options: ["Hello, ADA!", "Hello, ada!", "Hello, {name.toUpperCase()}!", "Nothing: props can't be transformed inside JSX"],
      answer: [0],
      explanation: "Curly braces in JSX evaluate any JavaScript expression, so `name.toUpperCase()` runs and the result \"ADA\" is inserted.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      prompt: "Why must a React component's name start with a capital letter?",
      options: [
        "JSX treats lowercase tags as built-in HTML elements and capitalised tags as references to components",
        "Capitalised functions are automatically memoized",
        "It's only a style convention; lowercase components work the same",
        "React looks components up by name in a global registry",
      ],
      answer: [0],
      explanation: "`<button>` compiles to the string \"button\" (a DOM element), while `<Button>` compiles to the `Button` variable. A lowercase component would be treated as an unknown HTML tag.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      type: "lines",
      prompt: "This component breaks the rule that rendering must be pure. Tap the line.",
      code: `function Price({ item }) {
  item.price = item.price * 1.13;
  return <span>\${item.price.toFixed(2)}</span>;
}`,
      codeLang: "jsx",
      answer: [2],
      explanation: "Line 2 mutates a prop. Each render adds tax again, and the parent's data changes behind its back. Compute a new value instead: `const total = item.price * 1.13`.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-jsx",
      level: "intermediate",
      prompt: "What does this render when `count` is 0?",
      code: `function Inbox({ count }) {
  return (
    <div>
      {count && <p>You have {count} messages</p>}
    </div>
  );
}

<Inbox count={0} />`,
      codeLang: "jsx",
      options: ["<div>0</div>", "<div></div>", "<div><p>You have 0 messages</p></div>", "It throws, because 0 isn't a valid child"],
      answer: [0],
      explanation: "`0 && …` gives `0`, and React shows numbers, so a stray \"0\" appears. Use `count > 0 && …` or a ternary. `false`, `null` and `undefined` show nothing, but `0` does.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-props-state",
      level: "junior",
      prompt: "Which statement about props and state is correct?",
      options: [
        "Props are passed in by the parent and are read-only to the child; state is owned by the component and changed through its setter",
        "Props and state are the same thing; state is just the name for props inside class components",
        "A child can update its props directly to tell the parent about changes",
        "State is shared automatically between every instance of a component",
      ],
      answer: [0],
      explanation: "Props flow down, and the child must not change them. State is private memory for each copy of a component, and calling its setter asks React to re-render.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      type: "match",
      prompt: "Match each piece of JSX syntax to what it does.",
      pairs: [
        ["`className=\"card\"`", "Sets the element's CSS class"],
        ["`{user.name}`", "Embeds a JavaScript expression"],
        ["`<>…</>`", "Groups siblings without adding a DOM node"],
        ["`style={{ color: \"red\" }}`", "Passes an inline style object"],
        ["`htmlFor=\"email\"`", "Links a label to an input"],
      ],
      explanation: "JSX uses DOM property names (`className`, `htmlFor`), braces for expressions, objects for `style`, and Fragments to return several siblings.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-props-state",
      level: "junior",
      prompt: "The user clicks this button three times. What does it show?",
      code: `function Counter() {
  let count = 0;
  return (
    <button onClick={() => { count++; }}>
      {count}
    </button>
  );
}`,
      codeLang: "jsx",
      options: ["0", "1", "3", "It throws: count is a constant"],
      answer: [0],
      explanation: "Changing a local variable doesn't trigger a render, and even if something else re-rendered, `let count = 0` would run again. Use `useState` for values that must persist and update the screen.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-rerender",
      level: "intermediate",
      prompt: "`count` starts at 0. What does the button show after one click?",
      code: `function Counter() {
  const [count, setCount] = useState(0);
  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={handleClick}>{count}</button>;
}`,
      codeLang: "jsx",
      options: ["1", "3", "0", "2"],
      answer: [0],
      explanation: "In this render `count` is 0, so all three calls ask for `0 + 1`. They are batched and the next render shows 1. To add 3, use the updater form `setCount(c => c + 1)`.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-rerender",
      level: "intermediate",
      prompt: "The button is clicked once. What is logged?",
      code: `function Name() {
  const [name, setName] = useState("Ada");
  function handleClick() {
    setName("Grace");
    console.log(name);
  }
  return <button onClick={handleClick}>{name}</button>;
}`,
      codeLang: "jsx",
      options: ["Ada", "Grace", "undefined", "Ada, then Grace"],
      answer: [0],
      explanation: "State is a snapshot. Calling the setter asks for the next render. It doesn't change the `name` this handler already captured. The next render will show \"Grace\".",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-rerender",
      level: "intermediate",
      type: "order",
      prompt: "Put the steps of a state update in order.",
      items: [
        "An event handler calls a state setter",
        "React queues the update and schedules a render",
        "React calls the component to compute new JSX",
        "React compares the new output with the previous one",
        "React commits only the changed DOM nodes",
      ],
      explanation: "The order is trigger, then render, then commit. Rendering is React calling your components. Committing is React applying the smallest set of changes to the page.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-rerender",
      level: "intermediate",
      prompt: "Which of these cause a component to re-render? (Choose two.)",
      options: [
        "Its own state changes through a setter",
        "Its parent re-renders",
        "A ref's `.current` value changes",
        "A prop object is mutated in place",
        "A module-level variable changes",
      ],
      answer: [0, 1],
      explanation: "State updates and parent re-renders (plus context changes) trigger renders. Refs, in-place mutation, and outside variables don't notify React at all.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-rerender",
      level: "intermediate",
      prompt: "A parent re-renders but passes exactly the same props to its child. By default, what happens to the child?",
      options: [
        "It re-renders too; React doesn't compare props unless the child is wrapped in `memo`",
        "It's skipped automatically because the props are equal",
        "It unmounts and remounts",
        "It re-renders only if it has state",
      ],
      answer: [0],
      explanation: "By default rendering is recursive: every child of a rendering component renders. `memo` opts a component into a shallow props comparison. (The React Compiler can add that memoization for you.)",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-keys",
      level: "intermediate",
      prompt: "The list starts as [A, B] and a new todo C is added at the start of the array. What goes wrong?",
      code: `{todos.map((todo, i) => (
  <li key={i}>
    <input defaultValue={todo.text} />
  </li>
))}`,
      codeLang: "jsx",
      options: [
        "React matches rows by index, so the existing inputs stay in slots 0 and 1 with their old values; C doesn't appear at the top",
        "Nothing; index keys are always safe",
        "React throws an error about duplicate keys",
        "Every input is cleared",
      ],
      answer: [0],
      explanation: "With index keys, key 0 and key 1 still exist, so React reuses those DOM inputs (showing A and B). Only key 2 is new. Use `key={todo.id}` so state follows the item.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-keys",
      level: "intermediate",
      type: "lines",
      prompt: "Every row loses its state and focus on each render. Tap the buggy line.",
      code: `function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={Math.random()}>{item.name}</li>
      ))}
    </ul>
  );
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "A random key changes every render, so React sees brand-new items and remounts them all. Use a stable id: `key={item.id}`.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-keys",
      level: "junior",
      prompt: "Keys in a list must be unique…",
      options: ["Among siblings in that list", "Across the whole app", "Across every list that uses the same component", "Only in production builds"],
      answer: [0],
      explanation: "Keys only need to be unique among items in the same list. Two different lists can use the same keys without any problem.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-keys",
      level: "senior",
      prompt: "Why would you write this?",
      code: `<Profile key={userId} userId={userId} />`,
      codeLang: "jsx",
      options: [
        "To reset all of Profile's state (form drafts, toggles) whenever the user changes",
        "To make Profile render faster",
        "Because every component needs a key",
        "To keep Profile's state when switching users",
      ],
      answer: [0],
      explanation: "A new key makes React unmount the old instance and mount a fresh one, so all state inside resets. It's simpler and less buggy than an effect that resets each piece of state.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-keys",
      level: "senior",
      type: "lines",
      prompt: "The input loses focus after every keystroke. Tap the line that causes it.",
      code: `function Form() {
  const [text, setText] = useState("");
  function Field() {
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }
  return <Field />;
}`,
      codeLang: "jsx",
      answer: [3],
      explanation: "`Field` is defined inside `Form`, so each render creates a new function, which React treats as a different component type. It unmounts the old input and mounts a new one. Move `Field` to the top level and pass props.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-keys",
      level: "senior",
      prompt: "`Counter` keeps a count in state. The count is 5 when `isAdmin` flips from true to false. What is the count afterwards?",
      code: `function App({ isAdmin }) {
  return isAdmin
    ? <Counter label="admin" />
    : <Counter label="guest" />;
}`,
      codeLang: "jsx",
      options: ["5", "0", "It depends on the label", "undefined"],
      answer: [0],
      explanation: "Both branches render the same component type at the same position, so React keeps the instance and its state, only updating the `label` prop. Give them different keys to reset.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-keys",
      level: "intermediate",
      prompt: "What is reconciliation?",
      options: [
        "React comparing the new element tree with the previous one to decide the minimal DOM changes",
        "Merging two components' state into one",
        "Re-running every effect after each render",
        "Syncing state between the server and client",
      ],
      answer: [0],
      explanation: "React diffs by type and key. Same type at the same position: update in place. Different type: tear down the old subtree and build a new one.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      prompt: "What does this render?",
      code: `const fruits = ["apple", "kiwi"];

function Lengths() {
  return <ul>{fruits.map((f) => <li key={f}>{f.length}</li>)}</ul>;
}`,
      codeLang: "jsx",
      options: ["Two items: 5 and 4", "Two items: apple and kiwi", "One item: 2", "Nothing, because map returns an array"],
      answer: [0],
      explanation: "`map` returns an array of elements and React renders arrays of children. \"apple\".length is 5 and \"kiwi\".length is 4.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      type: "lines",
      prompt: "The list always renders empty. Tap the buggy line.",
      code: `function Names({ people }) {
  return (
    <ul>
      {people.map((p) => {
        <li key={p.id}>{p.name}</li>;
      })}
    </ul>
  );
}`,
      codeLang: "jsx",
      answer: [5],
      explanation: "An arrow function with a `{}` body needs `return`. Without it the callback returns `undefined` for every person. Write `return <li …>` or use parentheses: `(p) => (<li …>)`.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-keys",
      level: "staff",
      prompt:
        "Your design-system `<DataList>` uses array index keys internally. Product teams report row inputs and checkboxes showing values from the wrong row after sorting. What do you change?",
      options: [
        "Make a stable key part of the API (for example a required `getKey(item)` that returns a data id), migrate callers, and keep index keys only for static lists",
        "Wrap each row in `memo` so it can't re-render",
        "Force a remount of the whole list on every sort with `key={Math.random()}` on the list",
        "Tell teams not to put inputs inside rows",
      ],
      answer: [0],
      explanation: "The real problem is identity: index keys tie state to positions in the list. Fix it in the shared component so every user of it gets proper keys. Rebuilding the whole list throws away all state and focus.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-rerender",
      level: "senior",
      prompt:
        "A page re-renders a 400-row table on every keystroke in a search box at the top. Profiling shows the search text lives in state in the page root. What's the best first change?",
      options: [
        "Move the input's state down into a `SearchBox` component (and lift only the submitted query), so typing doesn't re-render the table",
        "Store the search text in a `useRef` so nothing ever re-renders",
        "Wrap every component on the page in `memo`",
        "Move the state into a global store",
      ],
      answer: [0],
      explanation: "State colocation: keep state as close as possible to where it's used. Only the components under the state owner re-render, so moving it down removes the table from the blast radius without any memoization.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-jsx",
      level: "junior",
      prompt: "A component returns `null`. What happens?",
      options: [
        "Nothing is rendered to the DOM for it, but it is still mounted and keeps its state",
        "React throws an error",
        "React unmounts the component and its state is lost",
        "It renders the text \"null\"",
      ],
      answer: [0],
      explanation: "Returning `null` is the standard way to render nothing. The component still exists in the tree, so its state and effects stay alive.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-jsx",
      level: "staff",
      prompt:
        "After enabling `<StrictMode>`, a teammate sees analytics events firing twice in development and proposes turning Strict Mode off. What do you recommend?",
      options: [
        "Keep Strict Mode: the double render exposes a side effect in render. Move the event into an event handler (or an effect with cleanup) so it's pure",
        "Turn Strict Mode off; it's only for class components",
        "Keep Strict Mode on and deduplicate events with a module-level flag",
        "Turn Strict Mode off in development and on in production",
      ],
      answer: [0],
      explanation: "In development, Strict Mode calls components twice and runs effects an extra time, to expose code that isn't pure. Production runs once, but the bug is real: side effects during render also break concurrent rendering and the React Compiler.",
    },
  ],

  cards: [
    { id: "c-d1-jsx", domain: "d1", kind: "concept", term: "JSX", definition: "Syntax that looks like HTML inside JavaScript. It compiles to function calls (`jsx(type, props)`) that create React elements." },
    { id: "c-d1-component", domain: "d1", kind: "concept", term: "Component", definition: "A capitalised function that takes props and returns JSX. Must be pure: same inputs, same output, no side effects during render." },
    { id: "c-d1-props", domain: "d1", kind: "concept", term: "Props", definition: "Read-only inputs passed from parent to child, like function arguments." },
    { id: "c-d1-state", domain: "d1", kind: "concept", term: "State", definition: "A component's memory between renders. Updated only through its setter, which schedules a re-render." },
    { id: "c-d1-render", domain: "d1", kind: "concept", term: "Render vs commit", definition: "Rendering is when React calls your components to work out the JSX. Committing is when React applies the smallest set of changes to the page." },
    { id: "c-d1-snapshot", domain: "d1", kind: "concept", term: "State as a snapshot", definition: "Within one render, state values are constants. Setting state affects the next render, not the current variables." },
    { id: "c-d1-batching", domain: "d1", kind: "concept", term: "Automatic batching", definition: "React groups several state updates (in handlers, timeouts, promises) into one re-render." },
    { id: "c-d1-reconciliation", domain: "d1", kind: "concept", term: "Reconciliation", definition: "How React compares the new tree of elements with the old one, by type and key, to find the smallest set of changes to make to the page." },
    { id: "c-d1-key", domain: "d1", kind: "service", term: "key", definition: "Special prop that gives list items a stable identity among siblings. Changing it remounts the component and resets its state." },
    { id: "c-d1-fragment", domain: "d1", kind: "service", term: "Fragment (<>…</>)", definition: "Groups several children without adding a DOM element. Use `<Fragment key>` when a keyed group is needed." },
    { id: "c-d1-strict", domain: "d1", kind: "service", term: "StrictMode", definition: "Checks that run only in development. It renders components twice and runs each effect, its cleanup, then the effect again, to expose impure code and missing cleanups." },
  ],
});
