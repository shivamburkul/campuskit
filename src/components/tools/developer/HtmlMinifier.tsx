'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultStat } from '@/components/ui/Result';

export function HtmlMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  function minifyHtml(html: string): string {
    return html
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove leading/trailing whitespace
      .trim()
      // Collapse multiple spaces
      .replace(/\s{2,}/g, ' ')
      // Remove spaces around equals signs (but not inside values)
      .replace(/\s*=\s*/g, '=');
  }

  function handleMinify() {
    const result = minifyHtml(input);
    setOutput(result);
    setOriginalSize(input.length);
    setMinifiedSize(result.length);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">HTML Input</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={14}
          placeholder="<html>  <body>  <h1>Hello</h1>  </body></html>"
          className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
        />
        <Button type="button" onClick={handleMinify} className="mt-3">Minify</Button>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Minified Output</p>
        <textarea
          readOnly
          value={output}
          rows={14}
          className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-3 font-mono text-sm shadow-sm"
        />
        {output && (
          <div className="mt-3 flex gap-4 text-sm">
            <span className="text-ink-500">Original: {originalSize} bytes</span>
            <span className="text-ink-500">Minified: {minifiedSize} bytes</span>
            <span className="text-green-600 font-medium">
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
