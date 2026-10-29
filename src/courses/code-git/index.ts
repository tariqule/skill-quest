import { defineCourse, withQuestions } from "@/engine/define";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-snapshots";
import d2 from "./domains/d2-branches";
import d3 from "./domains/d3-remotes";
import d4 from "./domains/d4-undo-scale";

/**
 * Learn Git & GitHub: version control from zero. Snapshots and the three
 * areas, branches and the commit graph, remotes and pull requests, then
 * undoing, debugging, and team-scale practice. Command output was checked
 * against Git 2.46; the behaviour covered has been stable for years.
 */
export default defineCourse({
  id: "code-git",
  kind: "learning",
  category: "tools",
  tags: ["git", "github", "version control", "branches", "merge", "rebase", "pull requests", "commits", "reset", "stash"],
  provider: { id: "git", name: "Git", color: "#f05033", icon: "🌿" },
  code: "GIT",
  title: "Learn Git & GitHub",
  shortTitle: "Git",
  tagline: "From your first commit to rebases, reflog rescues and pull requests: learn Git by moving commits around and watching the graph redraw.",
  level: "Beginner",
  storageKey: "course:code-git:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this command print?\" or \"which command does this?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange commands or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each command or idea with what it does. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the command (or commands) in the snippet that caused the problem." },
    ],
  },

  guide: {
    source: {
      label: "Git learning path, based on the official Git documentation and Pro Git",
      version: "2026",
      date: "October 2026",
      url: "https://git-scm.com/doc",
    },
    facts: [
      { icon: "🏁", value: "30", label: "question final check", detail: "The final skill check mixes 30 questions from every world in 45 minutes. Score 70 to pass." },
      { icon: "🌱", value: "Zero", label: "experience needed", detail: "World 1 starts with what version control is. Each world builds on the last." },
      { icon: "🧪", value: "3", label: "playground labs", detail: "Stage files between the three areas, grow and rebase a commit graph, and resolve a real-looking merge conflict." },
      { icon: "💻", value: "Real", label: "command output", detail: "Snippets show what Git actually prints. Try them in a scratch repository: `git init` in an empty folder costs nothing." },
      { icon: "🐙", value: "Git + GitHub", label: "both covered", detail: "Git itself works offline; the remote worlds add the GitHub side: pull requests, forks, protection rules and releases." },
      { icon: "🛟", value: "Undo", label: "without fear", detail: "Most Git panic comes from not knowing how to undo. World 4 is all about getting back safely." },
    ],
    candidate: {
      is: [
        "New to version control, or using Git by copy-pasting commands you don't fully trust",
        "A developer, designer, analyst or writer joining a team that works on GitHub",
        "Comfortable with basic commits and want to understand branches, rebasing and recovery",
        "Setting up branching, review and protection rules for a team",
      ],
      isNot: [
        "A guide to a specific GUI client (the concepts apply to all of them)",
        "A GitHub Actions or CI/CD course",
        "Git internals beyond what helps you use Git confidently",
        "A full GitHub administration course (billing, SSO, enterprise settings)",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Basics", icon: "📸", services: ["git init", "git clone", "git status", "git add", "git commit", "git log", "git diff", ".gitignore"] },
        { category: "Branches", icon: "🌳", services: ["git branch", "git switch", "HEAD", "Fast-forward", "git merge", "git rebase", "Conflicts"] },
        { category: "Collaboration", icon: "⚓", services: ["Remotes", "fetch / pull / push", "origin/main", "force-with-lease", "Pull requests", "Forks"] },
        { category: "Releases", icon: "🏷️", services: ["git tag", "Annotated tags", "git describe", "Semantic versioning", "Release branches"] },
        { category: "Undo & debug", icon: "⏳", services: ["git restore", "git reset", "git revert", "git reflog", "git stash", "git cherry-pick", "git bisect"] },
        { category: "Team scale", icon: "🏢", services: ["Trunk-based", "GitFlow", "Protected branches", "CODEOWNERS", "Signed commits", "Partial clone", "Sparse checkout", "Git LFS"] },
      ],
    },
    tips: [
      { icon: "🧪", tip: "Practise in a throwaway repository: `mkdir sandbox && cd sandbox && git init`. Break things on purpose and fix them." },
      { icon: "🔍", tip: "Run `git status` before and after every command until you can predict what it will say." },
      { icon: "🌳", tip: "`git log --oneline --graph --all` shows the commit graph. Most confusion disappears once you can see it." },
      { icon: "🛟", tip: "Committed work is very hard to lose (the reflog remembers it). Uncommitted work is easy to lose, so commit or stash before risky commands." },
      { icon: "📏", tip: "Keep branches short-lived and pull requests small. Small changes merge cleanly and get reviewed properly." },
      { icon: "🚫", tip: "Never rewrite (rebase, amend, reset + force-push) commits that teammates already have." },
    ],
    officialPractice: { label: "Pro Git book (git-scm.com/book)", url: "https://git-scm.com/book/en/v2" },
  },

  cheatsheet: [
    {
      title: "Everyday basics",
      items: [
        ["git status", "Where am I, and what's staged, modified, untracked?"],
        ["git add <file> · git add -p", "Stage a file · stage chosen hunks"],
        ['git commit -m "msg"', "Record the index as a new commit"],
        ["git diff · git diff --staged", "Unstaged changes · staged changes"],
        ["git log --oneline --graph --all", "Draw the commit graph"],
        ["git restore <file>", "Discard working-tree edits (gone for good)"],
      ],
    },
    {
      title: "Branches",
      items: [
        ["git switch -c <name>", "Create a branch and switch to it"],
        ["git switch <name>", "Switch to an existing branch"],
        ["git merge <branch>", "Fast-forward, or create a merge commit"],
        ["git rebase <base>", "Replay your commits on top of base (new IDs)"],
        ["git branch -d <name>", "Delete a merged branch (-D forces)"],
        ["git merge --abort", "Back out of a conflicted merge"],
      ],
    },
    {
      title: "Remotes",
      items: [
        ["git fetch", "Download; update origin/*; never touches your work"],
        ["git pull", "fetch + merge (or --rebase) into current branch"],
        ["git push -u origin <branch>", "First push of a new branch; sets upstream"],
        ["git push --force-with-lease", "Safe force push after rebasing your own branch"],
        ["git push origin <tag>", "Tags aren't pushed by default"],
      ],
    },
    {
      title: "Undo",
      items: [
        ["git restore --staged <file>", "Unstage, keep edits"],
        ["git reset --soft HEAD~1", "Undo commit, keep changes staged"],
        ["git reset HEAD~1", "Undo commit, keep changes unstaged"],
        ["git reset --hard HEAD~1", "Undo commit and discard its changes"],
        ["git revert <commit>", "New commit that undoes one (safe when shared)"],
        ["git reflog", "Find where HEAD was before you broke it"],
      ],
    },
    {
      title: "Power tools",
      items: [
        ["git stash · git stash pop", "Shelve tracked changes · bring them back"],
        ["git stash -u", "Also stash untracked files"],
        ["git cherry-pick <commit>", "Copy one commit onto the current branch"],
        ["git bisect start <bad> <good>", "Binary-search for the first bad commit"],
        ["git bisect run <cmd>", "Automate it: exit 0 good, 1–127 bad, 125 skip"],
      ],
    },
    {
      title: "Naming commits",
      items: [
        ["HEAD~2", "Two first-parents back"],
        ["HEAD^2", "A merge commit's second parent"],
        ["main..feature", "On feature but not on main"],
        ["HEAD@{1}", "Where HEAD was one move ago (reflog)"],
        ["v1.1-1-gfa38738", "git describe: 1 commit after tag v1.1"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Final skill check", icon: "🏁", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick check", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Merge Conflict Hydra", emoji: "🐉" },
  matchLabel: "Git commands",
  levelTitles: [
    "Untracked File",
    "Staged Sprout",
    "First Committer",
    "Branch Hopper",
    "Fast-Forwarder",
    "Conflict Tamer",
    "Rebase Ranger",
    "Reflog Rescuer",
    "Bisect Detective",
    "Keeper of main",
  ],
});
