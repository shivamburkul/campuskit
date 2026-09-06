import { roundTo } from './gpa';
import { settleBalances, Settlement } from './finance';

export interface GroceryPerson {
  id: string;
  name: string;
  paid: number;
}

export interface GroceryItem {
  id: string;
  name: string;
  price: number; // price per unit
  quantity: number;
  /** Person ids sharing this item. Empty array = shared equally by everyone. */
  assignedTo: string[];
}

export type ChargeType = 'fixed' | 'percentage';
export type ChargeAllocation = 'equal' | 'proportional';

export interface AdditionalCharge {
  id: string;
  label: string;
  type: ChargeType;
  /** Rupee amount if type is 'fixed', or a percentage (0-100) of the item subtotal if 'percentage'. */
  value: number;
  allocation: ChargeAllocation;
  /** Coupons/discounts subtract from each person's total instead of adding. */
  isDiscount?: boolean;
}

export interface PersonBreakdown {
  personId: string;
  name: string;
  itemSubtotal: number;
  chargeBreakdown: { label: string; amount: number }[];
  finalTotal: number;
  paid: number;
  balance: number; // paid - finalTotal; positive = should receive money
}

export interface GrocerySplitResult {
  itemGrandTotal: number;
  chargesGrandTotal: number;
  grandTotal: number;
  people: PersonBreakdown[];
  settlements: Settlement[];
}

function itemTotal(item: GroceryItem): number {
  return roundTo(item.price * item.quantity, 2);
}

/**
 * Splits a shared grocery/expense bill across people, item by item, then
 * allocates delivery/tax/fee/discount charges either equally or
 * proportionally to how much each person actually consumed — and produces
 * a minimal-transaction settlement based on who already paid what.
 */
export function calculateGrocerySplit(
  people: GroceryPerson[],
  items: GroceryItem[],
  charges: AdditionalCharge[]
): GrocerySplitResult {
  const personIds = people.map((p) => p.id);
  const itemSubtotalByPerson = new Map<string, number>(personIds.map((id) => [id, 0]));

  for (const item of items) {
    const total = itemTotal(item);
    const sharers = item.assignedTo.length > 0 ? item.assignedTo.filter((id) => personIds.includes(id)) : personIds;
    if (sharers.length === 0) continue;
    const perPerson = total / sharers.length;
    for (const id of sharers) {
      itemSubtotalByPerson.set(id, (itemSubtotalByPerson.get(id) ?? 0) + perPerson);
    }
  }

  const itemGrandTotal = roundTo([...itemSubtotalByPerson.values()].reduce((a, b) => a + b, 0), 2);

  const chargeBreakdownByPerson = new Map<string, { label: string; amount: number }[]>(personIds.map((id) => [id, []]));
  let chargesGrandTotal = 0;

  for (const charge of charges) {
    const rawAmount = charge.type === 'fixed' ? charge.value : (charge.value / 100) * itemGrandTotal;
    const signedAmount = charge.isDiscount ? -Math.abs(rawAmount) : Math.abs(rawAmount);
    chargesGrandTotal += signedAmount;

    if (people.length === 0) continue;

    for (const person of people) {
      let share: number;
      if (charge.allocation === 'equal' || itemGrandTotal === 0) {
        share = signedAmount / people.length;
      } else {
        const personShareOfItems = (itemSubtotalByPerson.get(person.id) ?? 0) / itemGrandTotal;
        share = signedAmount * personShareOfItems;
      }
      chargeBreakdownByPerson.get(person.id)!.push({ label: charge.label, amount: roundTo(share, 2) });
    }
  }

  const peopleBreakdown: PersonBreakdown[] = people.map((person) => {
    const itemSubtotal = roundTo(itemSubtotalByPerson.get(person.id) ?? 0, 2);
    const chargeBreakdown = chargeBreakdownByPerson.get(person.id) ?? [];
    const chargesTotal = chargeBreakdown.reduce((sum, c) => sum + c.amount, 0);
    const finalTotal = roundTo(itemSubtotal + chargesTotal, 2);
    return {
      personId: person.id,
      name: person.name,
      itemSubtotal,
      chargeBreakdown,
      finalTotal,
      paid: roundTo(person.paid, 2),
      balance: roundTo(person.paid - finalTotal, 2),
    };
  });

  const settlements = settleBalances(peopleBreakdown.map((p) => ({ name: p.name, balance: p.balance })));

  return {
    itemGrandTotal,
    chargesGrandTotal: roundTo(chargesGrandTotal, 2),
    grandTotal: roundTo(itemGrandTotal + chargesGrandTotal, 2),
    people: peopleBreakdown,
    settlements,
  };
}
