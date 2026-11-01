import { afterEach } from "vitest";

/**
 * Some suites (code-games-run, coding-langs, store-tabs) run real programs with spawnSync. Between tests
 * Vitest only awaits microtasks, so a file full of synchronous child processes never lets the worker's
 * event loop run, and the worker's RPC to the main process ("onTaskUpdate") times out after 60s even
 * though every test passes. Yielding one macrotask after each test lets that RPC traffic through.
 */
afterEach(() => new Promise<void>((resolve) => setImmediate(resolve)));
