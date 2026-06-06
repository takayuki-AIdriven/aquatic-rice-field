"use client";

import { useState } from "react";

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-mono text-xs font-semibold text-indigo-900 shadow-sm transition hover:bg-indigo-100"
    >
      {copied ? "コピーしました" : "マークダウン全文をコピー"}
    </button>
  );
}
