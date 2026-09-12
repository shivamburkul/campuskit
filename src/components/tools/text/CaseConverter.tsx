'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function CaseConverter() {
  const [text, setText] = useState('');

  const convert = (type: 'uppercase' | 'lowercase' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab') => {
    switch (type) {
      case 'uppercase':
        setText(text.toUpperCase());
        break;
      case 'lowercase':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()));
        break;
      case 'sentence':
        setText(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
        break;
      case 'camel':
        setText(text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase()));
        break;
      case 'snake':
        setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'));
        break;
      case 'kebab':
        setText(text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-'));
        break;
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full resize-y rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
        placeholder="Enter text to convert..."
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" type="button" onClick={() => convert('uppercase')}>UPPERCASE</Button>
        <Button variant="secondary" type="button" onClick={() => convert('lowercase')}>lowercase</Button>
        <Button variant="secondary" type="button" onClick={() => convert('title')}>Title Case</Button>
        <Button variant="secondary" type="button" onClick={() => convert('sentence')}>Sentence case</Button>
        <Button variant="secondary" type="button" onClick={() => convert('camel')}>camelCase</Button>
        <Button variant="secondary" type="button" onClick={() => convert('snake')}>snake_case</Button>
        <Button variant="secondary" type="button" onClick={() => convert('kebab')}>kebab-case</Button>
        <Button variant="ghost" type="button" onClick={() => setText('')}>Clear</Button>
        <Button variant="ghost" type="button" disabled={!text} onClick={() => navigator.clipboard.writeText(text)}>Copy</Button>
      </div>
    </div>
  );
}
