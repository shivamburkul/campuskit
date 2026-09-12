'use client';
import { useState } from 'react';
import { NumberField, TextField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { ResultPanel, ResultStat, InlineNote } from '@/components/ui/Result';

interface Expense {
  id: number;
  name: string;
  amount: number;
  category: 'needs' | 'wants' | 'savings';
}

export function MonthlyBudgetCalculator() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: 'Rent', amount: 0, category: 'needs' },
    { id: 2, name: 'Food', amount: 0, category: 'needs' },
    { id: 3, name: 'Transport', amount: 0, category: 'needs' },
  ]);
  const [newExpense, setNewExpense] = useState('');
  const [newAmount, setNewAmount] = useState(0);
  const [newCategory, setNewCategory] = useState<'needs' | 'wants' | 'savings'>('needs');
  const [nextId, setNextId] = useState(4);
  const [addError, setAddError] = useState<string | null>(null);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = income - totalExpenses;
  const savingsRate = income > 0 ? Math.round((remaining / income) * 100) : 0;

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const addExpense = () => {
    if (!newExpense.trim()) {
      setAddError('Enter an expense name.');
      return;
    }
    if (newAmount <= 0) {
      setAddError('Enter an amount greater than 0.');
      return;
    }
    setAddError(null);
    setExpenses([...expenses, { id: nextId, name: newExpense, amount: newAmount, category: newCategory }]);
    setNextId(nextId + 1);
    setNewExpense('');
    setNewAmount(0);
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const categoryColors = {
    needs: 'text-blue-600 dark:text-blue-400',
    wants: 'text-amber-600 dark:text-amber-400',
    savings: 'text-moss-600 dark:text-moss-400',
  };

  return (
    <div>
      <NumberField label="Monthly income" value={income || ''} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)} />

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4">
        <TextField label="Expense" value={newExpense} onChange={(e) => setNewExpense(e.target.value)} placeholder="Expense name" />
        <NumberField label="Amount" value={newAmount || ''} onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink-700 dark:text-ink-300">Category</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as 'needs' | 'wants' | 'savings')}
            className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
          >
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="savings">Savings</option>
          </select>
        </div>
        <div className="flex items-center mt-[1.625rem]">
          <Button type="button" onClick={addExpense}>Add</Button>
        </div>
      </div>
      {addError && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{addError}</p>}

      <div className="mt-4 space-y-2">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center gap-3 rounded-xl border border-white/30 bg-white/30 p-3 shadow-sm backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70">
            <span className="flex-1 text-ink-950 dark:text-ink-50">{expense.name}</span>
            <span className="text-sm text-ink-600 dark:text-ink-400">₹{expense.amount.toFixed(2)}</span>
            <span className={`text-sm font-medium ${categoryColors[expense.category]}`}>{expense.category}</span>
            <Button variant="ghost" type="button" onClick={() => removeExpense(expense.id)} className="px-2">×</Button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ResultPanel>
          <ResultStat label="Total expenses" value={`₹${totalExpenses.toFixed(2)}`} />
          <ResultStat label="Remaining" value={`₹${remaining.toFixed(2)}`} emphasis />
          <ResultStat label="Savings rate" value={`${savingsRate}%`} />
          <div className="mt-3 border-t border-ink-200/60 pt-3">
            <p className="text-sm font-medium text-ink-700 mb-2">Category breakdown</p>
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="flex justify-between text-sm">
                <span className={`${categoryColors[category as keyof typeof categoryColors]}`}>{category}</span>
                <span className="text-ink-600 dark:text-ink-400">₹{amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </ResultPanel>
      </div>

      {remaining < 0 && (
        <div className="mt-4">
          <InlineNote tone="warning">Your expenses exceed your income! Consider reducing some costs.</InlineNote>
        </div>
      )}
    </div>
  );
}
