/**
 * Key Git concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["commit", /commit/i],
  ["snapshot", /snapshot/i],
  ["working tree", /working (tree|directory)/i],
  ["staging area", /stag|index/i],
  ["git add", /git add/],
  ["git status", /git status/],
  ["git log", /git log/],
  ["git diff", /git diff/],
  [".gitignore", /gitignore/],
  ["config", /git config|user\.(name|email)/],
  ["HEAD", /\bHEAD\b/],
  ["branch", /branch/i],
  ["switch / checkout", /git (switch|checkout)/],
  ["merge", /merge/i],
  ["fast-forward", /fast-forward/i],
  ["rebase", /rebase/i],
  ["conflict", /conflict/i],
  ["DAG / parent", /\bDAG\b|parent/i],
  ["remote", /remote|origin/i],
  ["clone", /clone/],
  ["fetch", /fetch/],
  ["pull", /\bpull\b/],
  ["push", /push/],
  ["force push", /--force|force-with-lease/],
  ["upstream / tracking", /upstream|remote-tracking|tracking branch/i],
  ["pull request", /pull request|\bPR\b/i],
  ["tag", /\btag/i],
  ["reset", /reset/],
  ["revert", /revert/],
  ["restore", /git restore/],
  ["reflog", /reflog/],
  ["stash", /stash/],
  ["cherry-pick", /cherry-pick/],
  ["bisect", /bisect/],
  ["squash", /squash/i],
];
