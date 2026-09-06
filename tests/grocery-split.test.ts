import { describe, it, expect } from 'vitest';
import { calculateGrocerySplit, GroceryPerson, GroceryItem, AdditionalCharge } from '../src/lib/tools/grocery-split';

const people: GroceryPerson[] = [
  { id: 'a', name: 'A', paid: 1200 },
  { id: 'b', name: 'B', paid: 0 },
  { id: 'c', name: 'C', paid: 0 },
];

describe('calculateGrocerySplit', () => {
  it('matches the README worked example: A=400, B=300, C=300 items, 200 shared delivery/tax, A paid 1200', () => {
    const items: GroceryItem[] = [
      { id: '1', name: 'A items', price: 400, quantity: 1, assignedTo: ['a'] },
      { id: '2', name: 'B items', price: 300, quantity: 1, assignedTo: ['b'] },
      { id: '3', name: 'C items', price: 300, quantity: 1, assignedTo: ['c'] },
    ];
    const charges: AdditionalCharge[] = [{ id: 'd', label: 'Delivery + tax', type: 'fixed', value: 200, allocation: 'equal' }];

    const result = calculateGrocerySplit(people, items, charges);

    expect(result.itemGrandTotal).toBe(1000);
    expect(result.grandTotal).toBe(1200);

    const a = result.people.find((p) => p.personId === 'a')!;
    const b = result.people.find((p) => p.personId === 'b')!;
    const c = result.people.find((p) => p.personId === 'c')!;

    // Each shares 200/3 of the delivery charge equally
    expect(a.itemSubtotal).toBe(400);
    expect(a.finalTotal).toBeCloseTo(400 + 200 / 3, 1);
    expect(b.finalTotal).toBeCloseTo(300 + 200 / 3, 1);
    expect(c.finalTotal).toBeCloseTo(300 + 200 / 3, 1);

    // A paid 1200 total, owes only their own share -> should receive money back
    expect(a.balance).toBeGreaterThan(0);
    expect(result.settlements.length).toBeGreaterThan(0);
  });

  it('splits an item shared by selected people evenly, not by everyone', () => {
    const items: GroceryItem[] = [{ id: '1', name: 'Shared pizza', price: 300, quantity: 1, assignedTo: ['a', 'b'] }];
    const result = calculateGrocerySplit(people, items, []);
    const a = result.people.find((p) => p.personId === 'a')!;
    const b = result.people.find((p) => p.personId === 'b')!;
    const c = result.people.find((p) => p.personId === 'c')!;
    expect(a.itemSubtotal).toBe(150);
    expect(b.itemSubtotal).toBe(150);
    expect(c.itemSubtotal).toBe(0);
  });

  it('treats an item with no assignedTo as shared by everyone', () => {
    const items: GroceryItem[] = [{ id: '1', name: 'Shared snacks', price: 300, quantity: 1, assignedTo: [] }];
    const result = calculateGrocerySplit(people, items, []);
    result.people.forEach((p) => expect(p.itemSubtotal).toBe(100));
  });

  it('handles quantity correctly', () => {
    const items: GroceryItem[] = [{ id: '1', name: 'Milk', price: 50, quantity: 3, assignedTo: ['a'] }];
    const result = calculateGrocerySplit(people, items, []);
    expect(result.people.find((p) => p.personId === 'a')!.itemSubtotal).toBe(150);
  });

  it('applies a percentage-based charge proportionally', () => {
    const items: GroceryItem[] = [
      { id: '1', name: 'A items', price: 800, quantity: 1, assignedTo: ['a'] },
      { id: '2', name: 'B items', price: 200, quantity: 1, assignedTo: ['b'] },
    ];
    const charges: AdditionalCharge[] = [{ id: 't', label: 'Tax', type: 'percentage', value: 10, allocation: 'proportional' }];
    const result = calculateGrocerySplit(
      [
        { id: 'a', name: 'A', paid: 0 },
        { id: 'b', name: 'B', paid: 0 },
      ],
      items,
      charges
    );
    // item grand total = 1000, tax = 100. A has 80% share -> 80, B has 20% -> 20
    const a = result.people.find((p) => p.personId === 'a')!;
    const b = result.people.find((p) => p.personId === 'b')!;
    expect(a.finalTotal).toBe(880);
    expect(b.finalTotal).toBe(220);
  });

  it('applies a discount as a negative amount', () => {
    const items: GroceryItem[] = [{ id: '1', name: 'Item', price: 1000, quantity: 1, assignedTo: [] }];
    const charges: AdditionalCharge[] = [{ id: 'c', label: 'Coupon', type: 'fixed', value: 100, allocation: 'equal', isDiscount: true }];
    const result = calculateGrocerySplit(people, items, charges);
    expect(result.grandTotal).toBe(900);
  });

  it('falls back to equal allocation when item grand total is zero', () => {
    const charges: AdditionalCharge[] = [{ id: 'd', label: 'Flat fee', type: 'fixed', value: 300, allocation: 'proportional' }];
    const result = calculateGrocerySplit(people, [], charges);
    result.people.forEach((p) => expect(p.finalTotal).toBeCloseTo(100, 1));
  });

  it('handles zero people gracefully', () => {
    const result = calculateGrocerySplit([], [], []);
    expect(result.people).toEqual([]);
    expect(result.settlements).toEqual([]);
  });

  it('produces a settlement that sums to zero net balance when total paid matches total spent', () => {
    const balancedPeople: GroceryPerson[] = [
      { id: 'a', name: 'A', paid: 900 },
      { id: 'b', name: 'B', paid: 0 },
      { id: 'c', name: 'C', paid: 0 },
    ];
    const items: GroceryItem[] = [{ id: '1', name: 'Groceries', price: 900, quantity: 1, assignedTo: [] }];
    const result = calculateGrocerySplit(balancedPeople, items, []);
    const totalBalance = result.people.reduce((sum, p) => sum + p.balance, 0);
    expect(Math.round(totalBalance)).toBe(0);
  });
});
