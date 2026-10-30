import { CodeBlock, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { sh } from "../snippet";

/** World 3: remotes, upstreams and diverged branches, pull requests, and tags. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Remotes & Collaboration",
    world: "The Harbor of Remotes",
    weight: 25,
    emoji: "⚓",
    color: "#f472b6",
    summary: "Sharing work with clone, fetch, pull and push, making sense of tracking branches and diverged histories, working through pull requests and forks, and marking releases with tags.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Remotes and syncing",
      covers: ["origin and other remotes", "fetch vs pull", "push and upstream branches", "Remote-tracking branches (origin/main)", "Rejected pushes and force-with-lease"],
    },
    {
      id: "3.2",
      title: "Pull requests and code review",
      covers: ["The pull-request workflow", "Forks and upstream", "Reviewable PRs", "Merge queues and code owners"],
    },
    {
      id: "3.3",
      title: "Tags and releases",
      covers: ["Lightweight vs annotated tags", "Pushing tags", "git describe", "Semantic versioning", "Release branches"],
    },
  ],

  lessons: [
    {
      id: "d3-start-remote",
      level: "beginner",
      task: "3.1",
      title: "What a remote is",
      check: ["git-b3-01", "git-b3-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "💻", title: "Your copy", text: "The repository on your computer. You commit here.", color: "#38bdf8" },
            { icon: "☁️", title: "The remote", text: "A shared copy on a site like GitHub, usually called origin.", color: "#f472b6" },
            { icon: "👩‍💻", title: "Teammates' copies", text: "Everyone has their own full copy and shares through the remote.", color: "#a3e635" },
          ]}
        />
      ),
      points: [
        "Think of a shared noticeboard in an office. Everyone keeps their own notes at their desk, and pins finished work on the board for others to see.",
        "In Git, that shared board is a **remote**: another copy of the repository, usually on a site like GitHub, GitLab or Bitbucket.",
        "`git clone <url>` downloads a project from a remote and remembers where it came from under the name `origin`.",
        "You still commit on your own computer. The remote only changes when you choose to send your commits there.",
      ],
      tip: "`git remote -v` shows which remotes your project knows about and their web addresses. It's a quick way to check where your work will go.",
    },
    {
      id: "d3-start-sync",
      level: "beginner",
      task: "3.1",
      title: "Push and pull: sharing your work",
      check: ["git-b3-03", "git-b3-04"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "⬇️", label: "git pull", sub: "Get your teammates' new commits" },
              { icon: "📸", label: "Commit", sub: "Do your own work locally" },
              { icon: "⬆️", label: "git push", sub: "Send your commits to the remote" },
            ]}
          />
          <CodeBlock lang="bash" caption="A typical start and end of a work session" code={sh("git pull                     # catch up first", "# ...edit, git add, git commit...", "git push                     # share what you did")} />
        </div>
      ),
      points: [
        "`git push` sends the commits you made on your computer up to the remote, so teammates can get them.",
        "`git pull` does the opposite. It downloads new commits from the remote and adds them to the branch you're on.",
        "A good habit is pull, work, push. Pulling first means you build on everyone's latest work, so your push goes through smoothly.",
      ],
      tip: "If `git push` is refused, don't reach for force. It usually just means someone pushed first: run `git pull`, then push again.",
    },
    {
      id: "d3-remotes",
      level: "junior",
      task: "3.1",
      title: "Remotes: clone, fetch, pull, push",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "☁️", label: "origin (GitHub)", sub: "The shared copy everyone pushes to" },
              { icon: "⬇️", label: "git fetch", sub: "Download new commits and update origin/main. Your branch is untouched." },
              { icon: "🔀", label: "git pull", sub: "Fetch, then merge or rebase into your current branch" },
              { icon: "⬆️", label: "git push", sub: "Upload your commits and move the branch on origin" },
            ]}
          />
          <CodeBlock
            lang="bash"
            code={sh(
              "git clone https://github.com/acme/shop.git   # remote 'origin' is set up",
              "git remote -v                                # list remotes and URLs",
              "git switch -c fix-typo",
              'git commit -am "Fix typo"',
              "git push -u origin fix-typo                  # first push sets the upstream",
              "git push                                     # later pushes just work",
            )}
          />
        </div>
      ),
      points: [
        "A **remote** is a short name for the web address of another copy of the repository. `clone` creates one called `origin`.",
        "`git fetch` is always safe. It only downloads, then updates your record of the remote's branches, like `origin/main`.",
        "`git pull` is a `git fetch` followed by a merge (or a rebase) of the remote branch into your current branch.",
        "The first push of a new branch needs `-u origin <branch>`. That sets its **upstream**, the remote branch it pairs with. After that, plain `git push` and `git pull` know where to go.",
      ],
      tip: "When unsure, `git fetch` first and look (`git log --oneline main..origin/main`) before you pull. Nothing you have can be changed by a fetch.",
    },
    {
      id: "d3-tracking",
      level: "intermediate",
      task: "3.1",
      title: "Tracking branches and rejected pushes",
      check: ["d3-06", "d3-10"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="bash"
            caption="Someone pushed while you were working"
            code={sh(
              "$ git push",
              " ! [rejected]        main -> main (fetch first)",
              "$ git fetch",
              "$ git status -sb",
              "## main...origin/main [ahead 1, behind 1]",
              "$ git pull --rebase      # replay your commit on top of theirs",
              "$ git push               # now it's a fast-forward for the server",
            )}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🛡️", title: "--force-with-lease", text: "Overwrite the remote branch only if it's still where you last saw it. Use it after rebasing your own branch.", color: "#34d399" },
              { icon: "💣", title: "--force", text: "Overwrite no matter what. If a teammate pushed in the meantime, their commits silently disappear from the branch.", color: "#fb7185" },
            ]}
          />
        </div>
      ),
      points: [
        "`origin/main` is a **remote-tracking branch**. It's your local, read-only note of where main was on origin the last time you fetched.",
        "\"ahead 1\" means you have a commit origin doesn't. \"behind 1\" means origin has one you don't. Both at once means the branches have diverged.",
        "The server accepts a push only if it simply moves its branch forward, a fast-forward. The exception is a forced push.",
        "Newer Git asks you to choose how `git pull` handles diverged branches. Set `pull.rebase true` to rebase, `false` to merge, or `pull.ff only` to refuse anything but a fast-forward.",
      ],
      tip: "Make `--force-with-lease` your only force push. Better still, protect shared branches so nobody can force-push them at all.",
    },
    {
      id: "d3-prs",
      level: "intermediate",
      task: "3.2",
      title: "Pull requests and code review",
      check: ["d3-11", "d3-12"],
      visual: (
        <Flow
          color="#f472b6"
          steps={[
            { icon: "🌱", label: "Branch", sub: "git switch -c add-coupons" },
            { icon: "⬆️", label: "Push", sub: "git push -u origin add-coupons" },
            { icon: "📬", label: "Open PR", sub: "Describe what and why; link the issue" },
            { icon: "🔍", label: "Review and CI", sub: "Comments, fixes, then the checks go green" },
            { icon: "✅", label: "Merge", sub: "Merge, squash or rebase; delete the branch" },
          ]}
        />
      ),
      points: [
        "A pull request (a merge request on GitLab) asks to merge one branch into another, with review, discussion and automated checks.",
        "If you can't push to a repository, which is normal in open source, **fork** it. A fork is your own copy on the host. Push there and open the PR from it.",
        "Keep your fork current by adding the original as a second remote, usually called `upstream`.",
        "Small, focused PRs with a clear description get reviewed faster and break less.",
      ],
      tip: "Review your own diff on GitHub before asking anyone else. You'll catch the debug prints and stray files yourself.",
    },
    {
      id: "d3-tags",
      level: "intermediate",
      task: "3.3",
      title: "Tags and releases",
      check: ["d3-17", "d3-18"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="bash"
            code={sh(
              "git tag v1.0                          # lightweight: just a name",
              'git tag -a v1.1 -m "Release 1.1"      # annotated: tagger, date, message',
              "git push origin v1.1                  # tags aren't pushed by default",
              "git describe                          # v1.1-1-gfa38738",
            )}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "💥", title: "MAJOR (2.0.0)", text: "Breaking changes", color: "#fb7185" },
              { icon: "✨", title: "MINOR (1.4.0)", text: "New, backwards-compatible features", color: "#f59e0b" },
              { icon: "🩹", title: "PATCH (1.3.2)", text: "Backwards-compatible bug fixes", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "A tag is a name for a commit that doesn't move, usually marking a release like `v1.4.0`.",
        "Annotated tags (`-a`) are full objects with a tagger, date and message, and can be signed. Prefer them for releases.",
        "`git push` doesn't send tags. Push one with `git push origin v1.4.0`, or use `--follow-tags`.",
        "`git describe` names a commit relative to the nearest annotated tag: `v1.1-1-gfa38738` is one commit after v1.1.",
      ],
      tip: "Never move or delete a release tag others may have fetched. If a release is bad, ship a new patch version instead.",
    },
  ],

  questions: [
    {
      id: "git-b3-01",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-remote",
      prompt: "In Git, what is a remote?",
      options: [
        "Another copy of the repository, often on a site like GitHub, that you can share commits with",
        "A setting that lets you control Git from your phone",
        "A backup that Git makes automatically every hour",
        "A branch that nobody is allowed to change",
      ],
      answer: [0],
      explanation: "A remote is just another copy of the project, stored somewhere you can reach over the network. You send commits to it with `git push` and get commits from it with `git pull`.",
    },
    {
      id: "git-b3-02",
      type: "output",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-remote",
      prompt: "You clone a project. Type the remote name that `git remote` prints.",
      code: "git clone -q https://github.com/acme/shop.git\ncd shop\ngit remote",
      codeLang: "bash",
      answers: ["origin"],
      explanation: "`git clone` remembers where the project came from and names that remote `origin`. It's only a nickname for the web address, and you'll see it in commands like `git push origin main`.",
    },
    {
      id: "git-b3-03",
      type: "fill",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-sync",
      prompt: "You've made two commits on your computer. Fill the gap to send them to the remote so your team can see them.",
      code: "git {{1}}",
      codeLang: "bash",
      blanks: [{ options: ["push", "pull", "clone", "status"], answer: 0 }],
      explanation: "`git push` uploads your new commits to the remote. `git pull` goes the other way, `git clone` copies a whole project, and `git status` only reports what's going on.",
    },
    {
      id: "git-b3-04",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-sync",
      prompt: "A teammate pushed new commits this morning. What does `git pull` do for you?",
      options: [
        "Downloads their new commits and adds them to the branch you're on",
        "Uploads your commits to the remote",
        "Deletes your local changes and starts fresh",
        "Creates a new branch called pull",
      ],
      answer: [0],
      explanation: "`git pull` fetches what's new on the remote and brings it into your current branch. Pull before you start work so you're building on the latest version.",
    },
    {
      id: "git-b3-05",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-remote",
      prompt: "Which statement about GitHub is true?",
      options: [
        "It's a website that stores Git repositories and helps people share and review them",
        "It's the program you install to make commits",
        "You can't use Git without it",
        "It only works with one branch per project",
      ],
      answer: [0],
      explanation: "Git is the tool on your computer. GitHub is one of several hosting sites (GitLab and Bitbucket are others) that keep a shared copy of your repository and add tools for working together.",
    },
    {
      id: "git-b3-06",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-sync",
      prompt: "`git push` is refused because the remote has commits you don't have yet. What's the usual next step?",
      options: [
        "Run `git pull` to get those commits, then `git push` again",
        "Delete the project and clone it again",
        "Keep running `git push` until it works",
        "Make an empty commit and push that",
      ],
      answer: [0],
      explanation: "Someone pushed before you, so Git won't let you overwrite their work. Pulling brings their commits into your branch, and then your push can go through.",
    },
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-remotes",
      prompt: "After `git clone https://github.com/acme/shop.git`, what is `origin`?",
      options: ["The default name Git gives the remote you cloned from", "The repository's first commit", "The main branch", "A backup folder Git creates"],
      answer: [0],
      explanation: "A remote is a short name for a URL. `git remote -v` lists them; you can add more, such as `upstream` for a fork's original.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-remotes",
      prompt: "What's the difference between `git fetch` and `git pull`?",
      options: [
        "`fetch` downloads new commits and updates `origin/*` without touching your branch; `pull` fetches and then integrates them into your current branch",
        "They're identical",
        "`fetch` uploads and `pull` downloads",
        "`pull` only works on main",
      ],
      answer: [0],
      explanation: "Fetch is read-only for your work. Pull is fetch followed by a merge or rebase, so it can create commits or conflicts.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "junior",
      lesson: "d3-remotes",
      type: "order",
      prompt: "Order a simple day on a shared branch: get teammates' work, do yours, share it.",
      items: ["`git pull`", "Edit files, then `git add` and `git commit`", "`git push`"],
      explanation: "Pulling first means you build on the latest work, so your push is more likely to be accepted without extra steps.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "junior",
      lesson: "d3-remotes",
      prompt: "What does `-u` add to this push?",
      code: sh("git push -u origin feature"),
      codeLang: "bash",
      options: [
        "It sets `origin/feature` as the branch's upstream, so later a plain `git push` or `git pull` knows where to go",
        "It pushes as a different user",
        "It pushes every branch",
        "It undoes the previous push",
      ],
      answer: [0],
      explanation: "`-u` is short for `--set-upstream`. `git status` then also reports how far ahead or behind the upstream you are.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-remotes",
      type: "lines",
      prompt: "The last command fails with `fatal: The current branch fix-typo has no upstream branch.` Tap the line that needs changing.",
      code: sh("git clone https://github.com/acme/shop.git", "cd shop", "git switch -c fix-typo", 'git commit -am "Fix typo"', "git push"),
      codeLang: "bash",
      answer: [5],
      explanation: "A new local branch has no upstream yet. The first push should be `git push -u origin fix-typo`. (Setting `push.autoSetupRemote` makes Git do this automatically.)",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tracking",
      prompt: "What does this mean?",
      code: sh("$ git status", "On branch main", "Your branch and 'origin/main' have diverged,", "and have 1 and 1 different commits each, respectively."),
      codeLang: "bash",
      options: [
        "You have 1 commit origin/main lacks and it has 1 you lack; integrate them (merge or rebase) before a normal push will work",
        "Your branch is fully up to date",
        "Someone deleted the branch on origin",
        "You have to clone the repository again",
      ],
      answer: [0],
      explanation: "Diverged means both sides have moved on. `git pull --rebase` replays your commit on top of theirs, and `git pull --no-rebase` makes a merge commit instead.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tracking",
      prompt: "`git push` is rejected with `(fetch first)`: the remote has commits you don't. What's the usual fix?",
      options: ["Pull (merge or rebase) to integrate their commits, then push again", "`git push --force`", "Delete your local branch", "`git commit --amend`"],
      answer: [0],
      explanation: "The server only accepts fast-forwards by default. Integrating their work first turns your push into one. Forcing would throw their commits away.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "senior",
      lesson: "d3-tracking",
      type: "lines",
      prompt: "After this, teammates find main rewritten and some of their pushed commits gone. Tap the two lines that caused it.",
      code: sh("git switch main", "git pull", "git rebase feature", "git push --force"),
      codeLang: "bash",
      answer: [3, 4],
      explanation: "Rebasing main onto feature rewrites main's shared commits, and `--force` overwrites origin/main, dropping anything pushed in the meantime. Merge feature into main instead.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tracking",
      prompt: "You rebased your own pushed branch and now need to force-push. Why prefer `--force-with-lease` over `--force`?",
      options: [
        "It refuses if the remote branch has commits you haven't seen, so you can't silently wipe someone else's push",
        "It uploads faster",
        "It merges automatically when there's a conflict",
        "It works without a network connection",
      ],
      answer: [0],
      explanation: "The lease is \"origin/branch is still where I last fetched it\". If someone pushed since, the push is refused and you can look before overwriting.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "junior",
      lesson: "d3-tracking",
      prompt: "What is `remotes/origin/main` in this output?",
      code: sh("$ git branch -a", "* main", "  remotes/origin/HEAD -> origin/main", "  remotes/origin/main"),
      codeLang: "bash",
      options: [
        "A remote-tracking branch: your local record of where main was on origin at your last fetch",
        "The live branch on the server, always up to date",
        "A branch you should commit to directly",
        "A tag",
      ],
      answer: [0],
      explanation: "It only moves when you fetch (or pull). To see what's new on the server, fetch and compare `main..origin/main`.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "junior",
      lesson: "d3-prs",
      prompt: "What is a pull request?",
      options: [
        "A request to merge one branch into another, with a place for review, discussion and automated checks",
        "Another name for `git pull`",
        "A way to download a repository",
        "A bug report",
      ],
      answer: [0],
      explanation: "Pull requests are a hosting-platform feature (GitLab calls them merge requests), not a Git command.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "junior",
      lesson: "d3-prs",
      type: "order",
      prompt: "Order a typical pull-request flow on GitHub.",
      items: [
        "Create a branch and commit your change",
        "Push the branch to GitHub",
        "Open a pull request against `main`",
        "Address review comments until checks pass and it's approved",
        "Merge the pull request and delete the branch",
      ],
      explanation: "New pushes to the same branch update the open PR automatically, so fixing review comments is just commit and push.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-prs",
      prompt: "When do you fork a repository instead of just making a branch?",
      options: [
        "When you don't have write access (typical in open source): you push to your own copy and open the PR from it",
        "For every feature, always",
        "When you want to delete history",
        "When you want to rename the repository",
      ],
      answer: [0],
      explanation: "With write access, branches in the same repository are simpler. Forks exist so outsiders can propose changes safely.",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-prs",
      type: "order",
      prompt: "You're on `main` in a fork you made months ago. Order the commands to bring it up to date with the original project.",
      items: [
        "`git remote add upstream https://github.com/original/project.git`",
        "`git fetch upstream`",
        "`git merge upstream/main`",
        "`git push origin main`",
      ],
      explanation: "Add the original as a remote, download its commits, merge them into your main, then update your fork on GitHub.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-prs",
      prompt: "What makes a pull request easy to review? (Choose two.)",
      options: [
        "It's small and focused on one change",
        "Its description says what changed, why, and how it was tested",
        "It bundles every unrelated fix to save time",
        "It has no description: the code speaks for itself",
        "It renames files and changes logic in the same commit",
      ],
      answer: [0, 1],
      explanation: "Reviewers can hold a small, explained change in their heads. Big mixed PRs get rubber-stamped, which is how bugs slip through.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "senior",
      lesson: "d3-prs",
      prompt: "A PR's CI passed yesterday, but main has moved since. After merging, main's build breaks. Which feature is designed to prevent exactly this?",
      options: [
        "A merge queue (or the rule that branches must be up to date before merging), which tests each PR against the latest main",
        "Draft pull requests",
        "Issue templates",
        "Release notes",
      ],
      answer: [0],
      explanation: "Two PRs can each pass alone and break together. Testing the actual merge result against current main, as a merge queue does, catches that.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "junior",
      lesson: "d3-tags",
      prompt: "What is a Git tag usually used for?",
      options: ["Naming a specific commit, like the release `v1.2.0`, with a label that doesn't move", "A branch that follows new commits", "Labelling GitHub issues", "Ignoring files"],
      answer: [0],
      explanation: "Branches move when you commit; tags stay put. That's what makes them good release markers.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tags",
      prompt: "What's the difference between these two tags?",
      code: sh("git tag v1.0", 'git tag -a v1.1 -m "Release 1.1"'),
      codeLang: "bash",
      options: [
        "`v1.0` is lightweight (just a name for a commit); `v1.1` is annotated (its own object with tagger, date and message, and it can be signed)",
        "There's no difference",
        "`-a` pushes the tag automatically",
        "`v1.0` is actually a branch",
      ],
      answer: [0],
      explanation: "`git cat-file -t v1.0` prints `commit`, while `git cat-file -t v1.1` prints `tag`. `git describe` uses annotated tags by default.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tags",
      type: "lines",
      prompt: "The release pipeline runs whenever a new tag reaches GitHub, but it never ran. Tap the line that should change.",
      code: sh("git switch main", "git pull", 'git tag -a v2.0.0 -m "Release 2.0.0"', "git push"),
      codeLang: "bash",
      answer: [4],
      explanation: "A plain `git push` sends branches, not tags. Use `git push origin v2.0.0` (or `git push --follow-tags`).",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "senior",
      lesson: "d3-tags",
      prompt: "What does this output tell you?",
      code: sh("$ git describe", "v1.1-1-gfa38738"),
      codeLang: "bash",
      options: [
        "The current commit is 1 commit after the tag `v1.1`, and its abbreviated ID is `fa38738`",
        "The version is 1.1.1",
        "This is the first release",
        "Tag v1.1 is corrupted",
      ],
      answer: [0],
      explanation: "Read it left to right: the nearest tag, how many commits since that tag, then `g` (for git) and the short hash. Build systems often use it as a version string.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-tags",
      prompt: "With semantic versioning, your library is at `v2.3.1` and you add a backwards-compatible feature. What's the next version?",
      options: ["`v2.4.0`", "`v3.0.0`", "`v2.3.2`", "`v2.4.1`"],
      answer: [0],
      explanation: "Versions read MAJOR.MINOR.PATCH. A new feature that doesn't break anything bumps MINOR and resets PATCH to 0. A breaking change would bump MAJOR to 3.0.0.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "staff",
      lesson: "d3-prs",
      prompt: "Several teams share one repository. You want the payments team to be required reviewers for any change under `services/payments/`. What do you set up?",
      options: [
        "A `CODEOWNERS` entry for that path, plus a branch rule that requires code-owner review",
        "A separate fork for the payments team",
        "A pre-commit hook on every laptop",
        "A `.gitignore` entry for the folder",
      ],
      answer: [0],
      explanation: "CODEOWNERS maps paths to owners and auto-requests their review; the protection rule makes that approval mandatory. Local hooks can be skipped.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-tags",
      prompt: "You maintain v1 and v2 of a library. A security fix merged to main must ship in both. What's the standard approach?",
      options: [
        "Keep release branches (`release/1.x`, `release/2.x`), cherry-pick the fix onto each, and tag new patch releases",
        "Merge all of main into `release/1.x`",
        "Move the existing v1 tags to point at main",
        "Only fix v2 and tell v1 users to upgrade",
      ],
      answer: [0],
      explanation: "Cherry-picking brings only the fix, not main's new features. New patch tags (v1.8.4, v2.3.2) leave old tags untouched.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-remotes",
      prompt: "A CI job clones a repository with 15 years of history on every run, and cloning alone takes minutes. The job only builds the latest commit. What's the best quick win?",
      options: ["A shallow clone: `git clone --depth 1`", "`git clone --mirror`", "Running `git gc` on the server every hour", "Cloning twice in parallel"],
      answer: [0],
      explanation: "A shallow clone fetches only recent history. Jobs that need history (versioning from tags, diffs against main) can fetch more depth or use a partial clone instead.",
    },
  ],

  cards: [
    { id: "c3-remote", domain: "d3", kind: "service", term: "git remote", definition: "Manage named URLs for other copies of the repository (origin, upstream)." },
    { id: "c3-fetch", domain: "d3", kind: "service", term: "git fetch", definition: "Download new commits and update remote-tracking branches. Never touches your work." },
    { id: "c3-pull", domain: "d3", kind: "service", term: "git pull", definition: "git fetch, then merge (or rebase) the upstream into the current branch." },
    { id: "c3-push", domain: "d3", kind: "service", term: "git push", definition: "Upload commits and move the remote branch. Accepted only as a fast-forward unless forced." },
    { id: "c3-lease", domain: "d3", kind: "service", term: "git push --force-with-lease", definition: "Force-push only if the remote branch is still where you last saw it." },
    { id: "c3-tag", domain: "d3", kind: "service", term: "git tag", definition: "Name a commit permanently. -a makes an annotated tag with a message." },
    { id: "c3-describe", domain: "d3", kind: "service", term: "git describe", definition: "Name a commit relative to the nearest annotated tag, for example v1.1-1-gfa38738." },
    { id: "c3-codeowners", domain: "d3", kind: "service", term: "CODEOWNERS", definition: "A file mapping paths to the people or teams who must review changes to them." },
    { id: "c3-tracking", domain: "d3", kind: "concept", term: "Remote-tracking branch", definition: "A branch like origin/main: your local record of where a remote branch was at your last fetch." },
    { id: "c3-upstream", domain: "d3", kind: "concept", term: "Upstream branch", definition: "The remote branch a local branch pushes to and pulls from by default (set with push -u)." },
    { id: "c3-pr", domain: "d3", kind: "concept", term: "Pull request", definition: "A hosted request to merge a branch, with review, discussion and CI checks." },
    { id: "c3-fork", domain: "d3", kind: "concept", term: "Fork", definition: "Your own server-side copy of someone else's repository, used to propose changes without write access." },
  ],
});
