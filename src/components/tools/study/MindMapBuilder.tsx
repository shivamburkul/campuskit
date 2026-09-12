'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';

interface Node {
  id: number;
  text: string;
  children: Node[];
}

let idCounter = 1;
function nextId() {
  idCounter += 1;
  return idCounter;
}

function addChild(node: Node, parentId: number): Node {
  if (node.id === parentId) {
    return { ...node, children: [...node.children, { id: nextId(), text: 'New idea', children: [] }] };
  }
  return { ...node, children: node.children.map((c) => addChild(c, parentId)) };
}

function removeNode(node: Node, targetId: number): Node {
  return {
    ...node,
    children: node.children
      .filter((c) => c.id !== targetId)
      .map((c) => removeNode(c, targetId)),
  };
}

function renameNode(node: Node, targetId: number, text: string): Node {
  if (node.id === targetId) return { ...node, text };
  return { ...node, children: node.children.map((c) => renameNode(c, targetId, text)) };
}

function countNodes(node: Node): number {
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}

const BRANCH_COLORS = [
  'border-primary-400 bg-primary-50/60 dark:bg-primary-900/20',
  'border-violet-400 bg-violet-50/60 dark:bg-violet-900/20',
  'border-amber-400 bg-amber-50/60 dark:bg-amber-900/20',
  'border-moss-400 bg-moss-50/60 dark:bg-moss-900/20',
  'border-rose-400 bg-rose-50/60 dark:bg-rose-900/20',
];

function NodeBranch({
  node,
  depth,
  colorIndex,
  onAddChild,
  onRemove,
  onRename,
}: {
  node: Node;
  depth: number;
  colorIndex: number;
  onAddChild: (id: number) => void;
  onRemove: (id: number) => void;
  onRename: (id: number, text: string) => void;
}) {
  const colorClass = BRANCH_COLORS[colorIndex % BRANCH_COLORS.length];

  return (
    <div className={depth > 0 ? 'ml-4 border-l-2 border-dashed border-ink-200 pl-4 dark:border-ink-700 sm:ml-6 sm:pl-6' : ''}>
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm ${colorClass}`}>
        <input
          type="text"
          value={node.text}
          onChange={(e) => onRename(node.id, e.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-ink-900 outline-none dark:text-ink-50"
        />
        <button
          type="button"
          onClick={() => onAddChild(node.id)}
          className="rounded-full px-2 text-xs font-medium text-primary-600 hover:bg-white/50 dark:text-primary-300"
          aria-label="Add sub-idea"
        >
          + Add
        </button>
        {depth > 0 && (
          <button
            type="button"
            onClick={() => onRemove(node.id)}
            className="rounded-full px-2 text-xs font-medium text-ink-500 hover:bg-white/50 dark:text-ink-400"
            aria-label="Remove node"
          >
            ×
          </button>
        )}
      </div>
      {node.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((child, i) => (
            <NodeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              colorIndex={depth === 0 ? i : colorIndex}
              onAddChild={onAddChild}
              onRemove={onRemove}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MindMapBuilder() {
  const [root, setRoot] = useState<Node>({
    id: 1,
    text: 'Central Topic',
    children: [
      { id: 2, text: 'Branch 1', children: [] },
      { id: 3, text: 'Branch 2', children: [] },
    ],
  });
  const [title, setTitle] = useState('My Mind Map');

  function handleAddChild(id: number) {
    setRoot((r) => addChild(r, id));
  }
  function handleRemove(id: number) {
    setRoot((r) => removeNode(r, id));
  }
  function handleRename(id: number, text: string) {
    setRoot((r) => renameNode(r, id, text));
  }

  function exportAsText() {
    const lines: string[] = [];
    function walk(node: Node, depth: number) {
      lines.push(`${'  '.repeat(depth)}${depth === 0 ? '' : '- '}${node.text}`);
      node.children.forEach((c) => walk(c, depth + 1));
    }
    walk(root, 0);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase() || 'mind-map'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <TextField label="Map title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Mind Map" />

      <div className="rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/50">
        <NodeBranch
          node={root}
          depth={0}
          colorIndex={0}
          onAddChild={handleAddChild}
          onRemove={handleRemove}
          onRename={handleRename}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-ink-500 dark:text-ink-400">{countNodes(root)} node(s)</span>
        <Button variant="secondary" type="button" onClick={exportAsText}>
          Export as text
        </Button>
      </div>
    </div>
  );
}
