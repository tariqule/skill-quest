/**
 * Key React concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["JSX", /\bJSX\b/],
  ["props", /\bprops\b/i],
  ["state", /\bstate\b/i],
  ["useState", /usestate/i],
  ["useEffect", /useeffect/i],
  ["useRef", /useref/i],
  ["useMemo", /usememo/i],
  ["useCallback", /usecallback/i],
  ["useReducer", /usereducer/i],
  ["useContext / context", /usecontext|\bcontext\b/i],
  ["useTransition", /usetransition|starttransition/i],
  ["useDeferredValue", /usedeferredvalue/i],
  ["useSyncExternalStore", /usesyncexternalstore/i],
  ["useOptimistic", /useoptimistic/i],
  ["useActionState", /useactionstate/i],
  ["use()", /\buse\(/],
  ["custom hook", /custom hook/i],
  ["rules of hooks", /rules of hooks/i],
  ["key", /\bkeys?\b/i],
  ["reconciliation", /reconcil/i],
  ["re-render", /re-?render/i],
  ["memo", /React\.memo|\bmemo\(/],
  ["React Compiler", /react compiler/i],
  ["StrictMode", /strict ?mode/i],
  ["controlled input", /controlled/i],
  ["lifting state up", /lift(ing)? state/i],
  ["prop drilling", /prop drilling/i],
  ["Suspense", /suspense/i],
  ["lazy loading", /\blazy\b|code[- ]split/i],
  ["error boundary", /error boundar/i],
  ["forwardRef / ref prop", /forwardref|ref as a prop/i],
  ["cleanup function", /cleanup|clean up/i],
  ["derived state", /derived|derive/i],
  ["Profiler", /profiler/i],
  ["virtualization", /virtuali[sz]|windowing/i],
];
