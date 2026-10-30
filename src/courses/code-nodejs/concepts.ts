/**
 * Key Node.js concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["event loop", /event loop/i],
  ["libuv", /libuv/i],
  ["thread pool", /thread pool|UV_THREADPOOL/i],
  ["microtask", /microtask/i],
  ["process.nextTick", /nextTick/],
  ["setImmediate", /setImmediate/],
  ["setTimeout", /setTimeout/],
  ["Promise", /promise/i],
  ["blocking", /block/i],
  ["worker_threads", /worker/i],
  ["stream", /\bstreams?\b/i],
  ["pipeline", /pipeline/],
  ["backpressure", /backpressure|highWaterMark/i],
  ["Buffer", /buffer/i],
  ["EventEmitter", /EventEmitter|\.emit\(|emitter/i],
  ["error event", /'error'|"error" event|error event/i],
  ["CommonJS", /CommonJS|require\(/i],
  ["ES modules", /\bESM\b|ES module|import /i],
  ["package.json", /package\.json/],
  ["async/await", /async|await/],
  ["uncaughtException", /uncaughtException/],
  ["unhandledRejection", /unhandled/i],
  ["cluster", /cluster/i],
  ["child_process", /child_process|spawn|fork/i],
  ["graceful shutdown", /SIGTERM|graceful/i],
  ["http server", /createServer|http\./],
  ["middleware", /middleware/i],
  ["environment variable", /process\.env|env var|environment variable/i],
  ["helmet / headers", /helmet|header/i],
  ["memory leak", /leak/i],
];
