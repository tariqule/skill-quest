"use client";

import { useRef, type KeyboardEvent, type UIEvent } from "react";
import { Tokens } from "@/components/learn/code";

/**
 * A small code editor: a transparent textarea laid over a syntax-coloured copy of the same text, so
 * typing, selection and mobile keyboards behave natively. Tab indents, Enter keeps the indent
 * (and opens a block after `{`), and Ctrl/Cmd+Enter runs.
 */
export function Editor({
  value,
  onChange,
  onRun,
  lang = "js",
  disabled = false,
  minLines = 10,
}: {
  value: string;
  onChange: (next: string) => void;
  onRun?: () => void;
  lang?: string;
  disabled?: boolean;
  minLines?: number;
}) {
  const area = useRef<HTMLTextAreaElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const lines = Math.max(minLines, value.split("\n").length + 1);

  function sync(e: UIEvent<HTMLTextAreaElement>) {
    if (!back.current) return;
    back.current.scrollTop = e.currentTarget.scrollTop;
    back.current.scrollLeft = e.currentTarget.scrollLeft;
  }

  function edit(next: string, caret: number) {
    onChange(next);
    requestAnimationFrame(() => area.current?.setSelectionRange(caret, caret));
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: end } = el;
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onRun?.();
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent the current line by up to two spaces.
        const lineStart = value.lastIndexOf("\n", s - 1) + 1;
        const lead = /^ {1,2}/.exec(value.slice(lineStart))?.[0].length ?? 0;
        if (lead) edit(value.slice(0, lineStart) + value.slice(lineStart + lead), Math.max(lineStart, s - lead));
      } else {
        edit(value.slice(0, s) + "  " + value.slice(end), s + 2);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const indent = /^[ \t]*/.exec(value.slice(lineStart, s))?.[0] ?? "";
      const before = value.slice(0, s).trimEnd();
      const open = /[{[(]$/.test(before);
      const closes = /^[\s]*[}\])]/.test(value.slice(end));
      const inner = indent + (open ? "  " : "");
      if (open && closes) {
        const text = value.slice(0, s) + "\n" + inner + "\n" + indent + value.slice(end);
        edit(text, s + 1 + inner.length);
      } else {
        edit(value.slice(0, s) + "\n" + inner + value.slice(end), s + 1 + inner.length);
      }
    }
  }

  const shared = "font-mono text-[13px] leading-6 whitespace-pre p-3";

  return (
    <div className="flex overflow-hidden rounded-xl border border-white/10 bg-slate-950 focus-within:border-sky-400/60" style={{ height: `${lines * 1.5 + 1.5}rem`, maxHeight: "28rem" }}>
      <div aria-hidden className="select-none border-r border-white/5 bg-white/[0.02] py-3 pl-3 pr-2 text-right font-mono text-[13px] leading-6 text-slate-600">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative min-w-0 flex-1">
        <div ref={back} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden text-slate-100 ${shared}`}>
          <Tokens code={value + "\n"} lang={lang} />
        </div>
        <textarea
          ref={area}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onScroll={sync}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label="Code editor"
          wrap="off"
          className={`absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent text-transparent caret-white outline-none selection:bg-sky-400/30 ${shared}`}
        />
      </div>
    </div>
  );
}
