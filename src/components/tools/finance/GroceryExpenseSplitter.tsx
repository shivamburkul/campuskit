'use client';
import { useState } from 'react';
import { NumberField, TextField, SelectField } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { InlineNote } from '@/components/ui/Result';
import { calculateGrocerySplit, GroceryPerson, GroceryItem, AdditionalCharge } from '@/lib/tools/grocery-split';

// Improved ID generator using crypto.randomUUID if available, else fallback
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function GroceryExpenseSplitter() {
  const [people, setPeople] = useState<GroceryPerson[]>([
    { id: generateId(), name: 'You', paid: 0 },
    { id: generateId(), name: 'Roommate', paid: 0 },
  ]);
  const [items, setItems] = useState<GroceryItem[]>([
    { id: generateId(), name: 'Milk & bread', price: 0, quantity: 1, assignedTo: [] },
  ]);
  const [charges, setCharges] = useState<AdditionalCharge[]>([
    { id: generateId(), label: 'Delivery fee', type: 'fixed', value: 0, allocation: 'equal' },
  ]);

  const result = calculateGrocerySplit(people, items, charges);

  function updatePerson(id: string, patch: Partial<GroceryPerson>) {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function updateItem(id: string, patch: Partial<GroceryItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  function updateCharge(id: string, patch: Partial<AdditionalCharge>) {
    setCharges((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function toggleAssignment(itemId: string, personId: string) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        const has = i.assignedTo.includes(personId);
        return { ...i, assignedTo: has ? i.assignedTo.filter((id) => id !== personId) : [...i.assignedTo, personId] };
      })
    );
  }

  function removePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setItems((prev) => prev.map((i) => ({ ...i, assignedTo: i.assignedTo.filter((pid) => pid !== id) })));
  }

  return (
    <div className="space-y-10">
      {/* People */}
      <section>
        <h3 className="font-medium text-ink-900">Who&apos;s splitting this?</h3>
        <div className="mt-3 space-y-3">
          {people.map((person, i) => (
            <div key={person.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_auto] sm:gap-x-4 items-start">
              <TextField label={i === 0 ? 'Name' : ''} value={person.name} onChange={(e) => updatePerson(person.id, { name: e.target.value })} id={`gp-name-${person.id}`} />
              <NumberField
                label={i === 0 ? 'Amount they paid' : ''}
                value={person.paid || ''}
                onChange={(e) => updatePerson(person.id, { paid: parseFloat(e.target.value) || 0 })}
                id={`gp-paid-${person.id}`}
              />
              <div className={`flex items-center pl-2 sm:pl-4 ${i === 0 ? 'mt-[1.625rem]' : ''}`}>
                <Button variant="ghost" type="button" onClick={() => removePerson(person.id)} disabled={people.length <= 2} className="px-3">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" type="button" className="mt-4" onClick={() => setPeople((prev) => [...prev, { id: generateId(), name: `Person ${prev.length + 1}`, paid: 0 }])}>
          + Add person
        </Button>
      </section>

      {/* Items */}
      <section>
        <h3 className="font-medium text-ink-900">Items</h3>
        <p className="mt-1 text-sm text-ink-500">
          Tick who shares each item. Leave everyone unticked to split that item equally between the whole group.
        </p>
        <div className="mt-3 space-y-4">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-md border border-ink-100 p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_auto] sm:gap-x-4 items-start">
                <TextField label={i === 0 ? 'Item' : ''} value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} id={`item-name-${item.id}`} />
                <NumberField label={i === 0 ? 'Price/unit' : ''} value={item.price || ''} onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })} id={`item-price-${item.id}`} />
                <NumberField label={i === 0 ? 'Qty' : ''} value={item.quantity || ''} min={1} onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 1 })} id={`item-qty-${item.id}`} />
                <div className={`flex items-center pl-2 sm:pl-4 ${i === 0 ? 'mt-[1.625rem]' : ''}`}>
                  <Button variant="ghost" type="button" onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))} disabled={items.length <= 1} className="px-3">
                    Remove
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {people.map((person) => (
                  <label key={person.id} className="flex items-center gap-1.5 text-sm text-ink-700">
                    <input type="checkbox" checked={item.assignedTo.includes(person.id)} onChange={() => toggleAssignment(item.id, person.id)} />
                    {person.name || 'Unnamed'}
                  </label>
                ))}
                <span className="text-xs text-ink-500">{item.assignedTo.length === 0 ? '(shared by everyone)' : ''}</span>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          type="button"
          className="mt-4"
          onClick={() => setItems((prev) => [...prev, { id: generateId(), name: `Item ${prev.length + 1}`, price: 0, quantity: 1, assignedTo: [] }])}
        >
          + Add item
        </Button>
      </section>

      {/* Charges - IMPROVED LAYOUT */}
      <section>
        <h3 className="font-medium text-ink-900">Delivery, tax, fees & discounts</h3>
        <div className="mt-3 space-y-4">
          {charges.map((charge, i) => (
            <div key={charge.id} className="rounded-md border border-ink-100 p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <TextField
                  label={i === 0 ? 'Label' : ''}
                  value={charge.label}
                  onChange={(e) => updateCharge(charge.id, { label: e.target.value })}
                  id={`charge-label-${charge.id}`}
                />
                <NumberField
                  label={i === 0 ? (charge.type === 'percentage' ? 'Value (%)' : 'Value (₹)') : ''}
                  value={charge.value || ''}
                  onChange={(e) => updateCharge(charge.id, { value: parseFloat(e.target.value) || 0 })}
                  id={`charge-value-${charge.id}`}
                />
                <SelectField
                  label={i === 0 ? 'Type' : ''}
                  value={charge.type}
                  onChange={(v) => updateCharge(charge.id, { type: v as 'fixed' | 'percentage' })}
                  options={[{ value: 'fixed', label: 'Fixed ₹' }, { value: 'percentage', label: '% of items' }]}
                />
                <SelectField
                  label={i === 0 ? 'Split' : ''}
                  value={charge.allocation}
                  onChange={(v) => updateCharge(charge.id, { allocation: v as 'equal' | 'proportional' })}
                  options={[{ value: 'equal', label: 'Equally' }, { value: 'proportional', label: 'By item share' }]}
                />
                <div className="flex items-center gap-4 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  <label className="flex items-center gap-2 text-sm text-ink-700">
                    <input type="checkbox" checked={!!charge.isDiscount} onChange={(e) => updateCharge(charge.id, { isDiscount: e.target.checked })} />
                    <span>Discount</span>
                  </label>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setCharges((prev) => prev.filter((c) => c.id !== charge.id))}
                    className="px-3 text-sm"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="secondary"
          type="button"
          className="mt-4"
          onClick={() => setCharges((prev) => [...prev, { id: generateId(), label: 'New charge', type: 'fixed', value: 0, allocation: 'equal' }])}
        >
          + Add charge
        </Button>
      </section>

      {/* Results */}
      <section className="mt-8">
        <h3 className="font-medium text-ink-900">Breakdown</h3>
        <div className="mt-3 space-y-3">
          {result.people.map((p) => (
            <div key={p.personId} className="rounded-lg border border-ink-100 p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-ink-950">{p.name || 'Unnamed'}</span>
                <span className="numeric-input text-lg font-semibold text-ink-950">₹{p.finalTotal.toFixed(2)}</span>
              </div>
              <ul className="mt-2 space-y-0.5 text-sm text-ink-700">
                <li className="flex justify-between"><span>Items consumed</span><span className="numeric-input">₹{p.itemSubtotal.toFixed(2)}</span></li>
                {p.chargeBreakdown.map((c, idx) => (
                  <li key={idx} className="flex justify-between text-ink-500">
                    <span>{c.label}</span>
                    <span className="numeric-input">{c.amount >= 0 ? '+' : ''}₹{c.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-ink-500">
                Paid ₹{p.paid.toFixed(2)} — {p.balance >= 0 ? `should receive ₹${p.balance.toFixed(2)}` : `owes ₹${Math.abs(p.balance).toFixed(2)}`}
              </p>
            </div>
          ))}
        </div>

        {result.settlements.length > 0 && (
          <div className="mt-4 rounded-lg border border-moss-100 bg-moss-100/40 p-4">
            <p className="text-sm font-medium text-ink-900">Settle up</p>
            <div className="mt-2 space-y-1">
              {result.settlements.map((s, i) => (
                <p key={i} className="text-sm text-ink-800">
                  <strong>{s.from}</strong> pays <strong>{s.to}</strong> ₹{s.amount.toFixed(2)}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-between text-sm text-ink-500">
          <span>Item total: ₹{result.itemGrandTotal.toFixed(2)}</span>
          <span>Charges total: ₹{result.chargesGrandTotal.toFixed(2)}</span>
          <span className="font-medium text-ink-900">Grand total: ₹{result.grandTotal.toFixed(2)}</span>
        </div>
      </section>

      <div className="mt-6">
        <InlineNote>
          Every number above is shown so you can check it — nothing is hidden. &quot;By item share&quot; splits a
          charge in proportion to how much each person&apos;s own items cost; &quot;Equally&quot; splits it evenly
          across everyone regardless of what they ordered.
        </InlineNote>
      </div>
    </div>
  );
}
