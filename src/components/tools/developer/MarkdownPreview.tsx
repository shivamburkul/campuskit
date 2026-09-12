'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

// Simple markdown parser for basic elements
function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Only allow safe URL schemes (or relative/anchor links) in href/src — this blocks
// javascript: URLs and similar injection vectors from user-typed markdown.
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|#|\/|\.\/|\.\.\/)/i.test(trimmed)) return escapeAttr(trimmed);
  return '#';
}

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')

    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')

    // Code inline
    .replace(/`([^`]+)`/g, '<code class="bg-ink-100 px-1 rounded">$1</code>')

    // Images (must run before the link pattern below, since ![alt](url) would
    // otherwise be partially consumed by the [text](url) link regex first,
    // leaving a stray "!" and never producing an <img> tag)
    .replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, src) => `<img src="${sanitizeUrl(src)}" alt="${escapeAttr(alt)}" />`)

    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, (_, text, href) => `<a href="${sanitizeUrl(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`)

    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')

    // Unordered list
    .replace(/^\s*[-*] (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')

    // Ordered list
    .replace(/^\s*(\d+)\. (.*$)/gm, '<li>$2</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ol>$1</ol>')

    // Horizontal rule
    .replace(/^---$/gm, '<hr>')

    // Line breaks
    .replace(/\n/g, '<br>');

  return html;
}

export function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(`# Markdown Demo

## Features

- **Bold text**
- *Italic text*
- \`Inline code\`

> This is a quote

[Link](https://example.com)

---
`);

  const html = parseMarkdown(markdown);

  function handleCopy() {
    navigator.clipboard.writeText(html);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Markdown</p>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={14}
          className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
        />
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Preview</p>
        <div
          className="prose prose-sm max-w-none border border-ink-100 bg-surface p-4 rounded-md min-h-[200px]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <Button variant="secondary" type="button" className="mt-3" onClick={handleCopy}>
          Copy HTML
        </Button>
      </div>
    </div>
  );
}
