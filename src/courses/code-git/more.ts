import type { Question } from "@/engine/types";

/**
 * Extra question types for the Git track: fill-in-the-flag and "type the output" questions.
 * Every output answer was produced by running the commands in a throwaway repository with Git 2.46
 * (hash-free formats only: `--short`, `--format=%s`, `rev-list --count`).
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "git-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-areas",
    prompt: "Fill the gap so the commit includes the edits you made to files Git already tracks, without a separate `git add`.",
    code: "git commit {{1}} -m \"Fix typo in README\"",
    codeLang: "bash",
    blanks: [{ options: ["-a", "-A", "--amend", "--force"], answer: 0 }],
    explanation:
      "`git commit -a` (`--all`) stages every modified or deleted tracked file before committing. It does not pick up brand-new untracked files. `-A` is a flag of `git add`, not of `git commit`, and `--amend` rewrites the previous commit.",
  },
  {
    id: "git-fx-02",
    type: "fill",
    domain: "d2",
    level: "junior",
    lesson: "d2-branches",
    prompt: "Fill the gap so Git creates the branch and moves you onto it in one command.",
    code: "git switch {{1}} feature/login",
    codeLang: "bash",
    blanks: [{ options: ["-c", "-b", "-d", "--track"], answer: 0 }],
    explanation:
      "`git switch -c <name>` (`--create`) makes a new branch at the current commit and switches to it. `-b` is the spelling for the older `git checkout -b`; `git switch` does not accept it.",
  },
  {
    id: "git-fx-03",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-tracking",
    prompt:
      "Fill the gap so the first push also links your local branch to `origin/feature/login`, letting a later bare `git push` and `git pull` work.",
    code: "git push {{1}} origin feature/login",
    codeLang: "bash",
    blanks: [{ options: ["-u", "-f", "-d", "-n"], answer: 0 }],
    explanation:
      "`-u` (`--set-upstream`) records the remote branch as this branch's upstream. `-f` forces a non-fast-forward push, `-d` deletes the remote branch, and `-n` is a dry run that pushes nothing.",
  },
  {
    id: "git-fx-04",
    type: "fill",
    domain: "d4",
    level: "intermediate",
    lesson: "d4-undo",
    prompt:
      "You haven't pushed yet. Fill the gap so the last commit disappears from history but its changes stay staged, ready to commit again.",
    code: "git reset {{1}} HEAD~1",
    codeLang: "bash",
    blanks: [{ options: ["--soft", "--mixed", "--hard", "--amend"], answer: 0 }],
    explanation:
      "`--soft` moves the branch back and leaves the index and the working tree alone, so the undone commit's changes remain staged. `--mixed` (the default) also unstages them, `--hard` throws them away, and `--amend` is not a reset option at all.",
  },
  {
    id: "git-fx-05",
    type: "fill",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-history",
    prompt:
      "Fill the gap to list the commits whose diff added or removed the text `retryCount` (the \"pickaxe\" search), one line each.",
    code: "git log {{1}}retryCount --oneline",
    codeLang: "bash",
    blanks: [{ options: ["-S", "-s", "--grep=", "-L"], answer: 0 }],
    explanation:
      "`git log -S<text>` finds commits that changed the number of occurrences of that text, so it shows where a symbol was introduced or deleted. `--grep=` searches commit messages, not code, and `-L` follows a line range of a file.",
  },
  {
    id: "git-fx-06",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-team",
    prompt:
      "The monorepo is huge. Fill the gap to clone the full history but download file contents (blobs) only when they are needed.",
    code: "git clone {{1}}=blob:none https://example.com/big.git",
    codeLang: "bash",
    blanks: [{ options: ["--filter", "--depth", "--branch", "--reference"], answer: 0 }],
    explanation:
      "`--filter=blob:none` makes a partial clone: commits and trees come down, and Git fetches file contents on demand when you check them out. `--depth` would truncate the history instead (a shallow clone), and `--reference` borrows objects from another local repo.",
  },

  // ───────────── output ─────────────
  {
    id: "git-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-areas",
    prompt: "Type the two lines `git status --short` prints, in the order Git prints them.",
    code:
      "git init -q\necho a > a.txt\ngit add a.txt\ngit commit -qm \"one\"\n\necho b > b.txt\necho a2 >> a.txt\ngit status --short",
    codeLang: "bash",
    answers: ["M a.txt\n?? b.txt", " M a.txt\n?? b.txt"],
    explanation:
      "`a.txt` is tracked and modified but not staged, so it shows ` M` (nothing in the first column, `M` in the second: working tree changed). `b.txt` was never added, so it is `??` untracked. Git lists tracked changes before untracked files.",
  },
  {
    id: "git-ox-02",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-merge-rebase",
    prompt:
      "Main holds commit `a`. A `topic` branch adds commit `b`. Type the three subject lines `git log --topo-order --format=%s` prints, newest first, one per line.",
    code:
      "git init -q -b main\ngit commit -q --allow-empty -m a\ngit switch -qc topic\ngit commit -q --allow-empty -m b\ngit switch -q main\ngit merge -q --no-ff topic -m merged\ngit log --topo-order --format=%s",
    codeLang: "bash",
    answers: ["merged\nb\na"],
    explanation:
      "`--no-ff` forces a real merge commit even though a fast-forward was possible, so `merged` is the newest commit. Its second parent is `b`, whose parent is `a`. Without `--no-ff`, main would just move to `b` and there would be no `merged` line.",
  },
  {
    id: "git-ox-03",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-dag",
    prompt: "Type the number `git rev-list --count main...topic` prints.",
    code:
      "git init -q -b main\ngit commit -q --allow-empty -m a\ngit commit -q --allow-empty -m b\ngit switch -qc topic\ngit commit -q --allow-empty -m d\ngit commit -q --allow-empty -m e\ngit switch -q main\ngit commit -q --allow-empty -m c\ngit rev-list --count main...topic",
    codeLang: "bash",
    answers: ["3"],
    explanation:
      "Three dots mean the symmetric difference: commits reachable from either branch but not both. `a` and `b` are shared. That leaves `c` (only on main) and `d` and `e` (only on topic): 3. With two dots, `main..topic` would count just `d` and `e`.",
  },
  {
    id: "git-ox-04",
    type: "output",
    domain: "d4",
    level: "intermediate",
    lesson: "d4-undo",
    prompt: "Type the line `git status --short` prints after the reset.",
    code:
      "git init -q\necho a > a.txt && git add a.txt && git commit -qm \"one\"\necho b > b.txt && git add b.txt && git commit -qm \"two\"\ngit reset -q --soft HEAD~1\ngit status --short",
    codeLang: "bash",
    answers: ["A b.txt", "A  b.txt"],
    explanation:
      "`--soft` moves the branch back to commit `one` but keeps the index, so `b.txt` is now a newly added, staged file: `A` in the first column and nothing in the second. With `--mixed` it would show `?? b.txt`, and with `--hard` the file would be gone.",
  },
  {
    id: "git-ox-05",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-team",
    prompt:
      "A team uses merge commits on `main`. Type the lines `git log --first-parent --format=%s` prints, newest first, one per line.",
    code:
      "git init -q -b main\ngit commit -q --allow-empty -m init\ngit switch -qc feature\ngit commit -q --allow-empty -m f1\ngit commit -q --allow-empty -m f2\ngit switch -q main\ngit merge -q --no-ff feature -m \"Merge feature\"\ngit log --first-parent --format=%s",
    codeLang: "bash",
    answers: ["Merge feature\ninit"],
    explanation:
      "`--first-parent` follows only the first parent of each merge, which is the branch you merged into. The branch's own commits `f1` and `f2` are hidden, so you read one line per merged change. That is why teams that merge with `--no-ff` can scan main's history, bisect it, and revert a whole feature with `git revert -m 1`.",
  },
  {
    id: "git-ox-06",
    type: "output",
    domain: "d3",
    level: "senior",
    lesson: "d3-tracking",
    prompt: "Type the number the last command prints.",
    code:
      "git init -q --bare remote.git -b main\ngit clone -q remote.git work && cd work\ngit commit -q --allow-empty -m a\ngit push -q -u origin main\ngit commit -q --allow-empty -m b\ngit commit -q --allow-empty -m c\ngit rev-list --count @{u}..HEAD",
    codeLang: "bash",
    answers: ["2"],
    explanation:
      "`@{u}` is the upstream of the current branch, here `origin/main`, which still stops at commit `a`. `@{u}..HEAD` counts commits you have that the upstream lacks: `b` and `c`. It is the number `git status` reports as \"ahead by 2\".",
  },
];
