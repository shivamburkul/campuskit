'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
  'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'JOIN', 'INNER',
  'LEFT', 'RIGHT', 'OUTER', 'ON', 'GROUP', 'BY', 'ORDER', 'HAVING',
  'AND', 'OR', 'NOT', 'NULL', 'AS', 'DISTINCT', 'LIMIT', 'OFFSET',
  'UNION', 'ALL', 'EXISTS', 'IN', 'BETWEEN', 'LIKE', 'IS', 'ASC', 'DESC',
  'INDEX', 'VIEW', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT',
  'DEFAULT', 'UNIQUE', 'CHECK', 'CASCADE', 'RESTRICT',
]);

export function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  function formatSql(sql: string): string {
    if (!sql.trim()) return '';

    // Protect string literals so keyword-matching below doesn't corrupt text that
    // happens to contain SQL keywords inside quotes (e.g. WHERE note = 'FROM here').
    const literals: string[] = [];
    let protectedSql = sql.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, (m) => {
      literals.push(m);
      return `\u0000${literals.length - 1}\u0000`;
    });

    // Basic formatting: add newlines before keywords
    let formatted = protectedSql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .trim();

    // Add newlines after closing parens followed by keywords
    formatted = formatted.replace(/\)\s+/g, ')\n  ');

    // Add newlines before major keywords
    const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT'];
    majorKeywords.forEach((kw) => {
      const regex = new RegExp(`\\s+${kw.replace(/\s/g, '\\s')}`, 'gi');
      formatted = formatted.replace(regex, `\n${kw.toUpperCase()} `);
    });

    // Add newlines before JOIN/UNION
    formatted = formatted.replace(/\s+(INNER|LEFT|RIGHT|OUTER|CROSS)?\s*JOIN\s/gi, '\n$1 JOIN ');
    formatted = formatted.replace(/\s+UNION\s/gi, '\nUNION ');
    formatted = formatted.replace(/\s+ON\s/gi, '\n  ON ');

    // Uppercase keywords
    formatted = formatted.replace(/\b(SELECT|FROM|WHERE|INSERT INTO|VALUES|UPDATE SET|DELETE FROM|CREATE TABLE|DROP TABLE|JOIN|ON|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|NOT|NULL|AS|DISTINCT|UNION|INNER|LEFT|RIGHT)\b/gi,
      (match) => match.toUpperCase());

    // Indent
    const lines = formatted.split('\n');
    const indented = lines.map((line, i) => {
      if (line.trim().startsWith('SELECT') || line.trim().startsWith('FROM') || line.trim().startsWith('WHERE')) {
        return i === 0 ? line : line;
      }
      if (line.trim().startsWith('GROUP') || line.trim().startsWith('ORDER') || line.trim().startsWith('HAVING')) {
        return line;
      }
      if (line.trim().startsWith('ON') || line.trim().startsWith('JOIN')) {
        return '  ' + line;
      }
      return line.trim().startsWith('AND') || line.trim().startsWith('OR') ? '  ' + line : line;
    });

    let result = indented.join('\n');
    // Restore protected string literals.
    result = result.replace(/\u0000(\d+)\u0000/g, (_, idx) => literals[Number(idx)] ?? '');
    return result;
  }

  function handleFormat() {
    setOutput(formatSql(input));
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Input SQL</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
          placeholder="SELECT id,name,age FROM users WHERE age>18 ORDER BY name"
          className="w-full resize-y rounded-md border border-ink-100 bg-surface p-3 font-mono text-sm shadow-sm outline-none focus:border-moss-500 focus:ring-1 focus:ring-moss-500"
        />
        <Button type="button" onClick={handleFormat} className="mt-3">Format</Button>
      </div>
      <div>
        <p className="mb-1.5 text-sm font-medium text-ink-700">Formatted SQL</p>
        <textarea
          readOnly
          value={output}
          rows={12}
          className="w-full resize-y rounded-md border border-ink-100 bg-ink-100/30 p-3 font-mono text-sm shadow-sm"
        />
        <Button variant="secondary" type="button" className="mt-3" disabled={!output} onClick={() => navigator.clipboard.writeText(output)}>
          Copy
        </Button>
      </div>
    </div>
  );
}
