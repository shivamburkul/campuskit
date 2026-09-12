'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function CssMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  function minifyCss(css: string): string {
    return css
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Collapse whitespace/newlines
      .replace(/\s+/g, ' ')
      // Remove space around specific characters
      .replace(/\s*([{}:;,>~+])\s*/g, '$1')
      // Remove trailing semicolon before closing brace
      .replace(/;}/g, '}')
      // Remove leading/trailing whitespace
      .trim();
  }

  function handleMinify() {
    const result = minifyCss(input);
    setOutput(result);
    setOriginalSize(input.length);
    setMinifiedSize(result.length);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700 dark:text-ink-300">CSS Input</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          placeholder=".box {&#10;  color: red;&#10;  margin: 0 auto;&#10;}"
          className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
        />
        <Button type="button" onClick={handleMinify} className="mt-3">Minify</Button>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700 dark:text-ink-300">Minified Output</p>
        <textarea
          readOnly
          value={output}
          rows={14}
          className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-3 font-mono text-sm shadow-sm dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-50"
        />
        {output && (
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-ink-500 dark:text-ink-400">Original: {originalSize} bytes</span>
            <span className="text-ink-500 dark:text-ink-400">Minified: {minifiedSize} bytes</span>
            <span className="font-medium text-moss-600 dark:text-moss-400">
              Saved: {originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0}%
            </span>
          </div>
        )}
        <Button variant="secondary" type="button" className="mt-3" disabled={!output} onClick={() => navigator.clipboard.writeText(output)}>
          Copy
        </Button>
      </div>
    </div>
  );
}
