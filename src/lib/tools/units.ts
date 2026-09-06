type ConversionMap = Record<string, number>; // value = multiplier to reach the base unit

// Each category's multipliers convert FROM the unit TO the category's base unit.
export const UNIT_CATEGORIES: Record<string, { base: string; units: ConversionMap }> = {
  length: {
    base: 'meter',
    units: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
    },
  },
  weight: {
    base: 'kilogram',
    units: {
      milligram: 0.000001,
      gram: 0.001,
      kilogram: 1,
      tonne: 1000,
      ounce: 0.0283495,
      pound: 0.453592,
    },
  },
  volume: {
    base: 'liter',
    units: {
      milliliter: 0.001,
      liter: 1,
      cubicMeter: 1000,
      gallonUS: 3.78541,
      quartUS: 0.946353,
      pintUS: 0.473176,
      cupUS: 0.24,
    },
  },
  area: {
    base: 'squareMeter',
    units: {
      squareMillimeter: 0.000001,
      squareCentimeter: 0.0001,
      squareMeter: 1,
      hectare: 10000,
      squareKilometer: 1_000_000,
      squareFoot: 0.092903,
      squareYard: 0.836127,
      acre: 4046.86,
    },
  },
  speed: {
    base: 'meterPerSecond',
    units: {
      meterPerSecond: 1,
      kilometerPerHour: 0.277778,
      milePerHour: 0.44704,
      knot: 0.514444,
    },
  },
  data: {
    base: 'byte',
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1024,
      megabyte: 1024 ** 2,
      gigabyte: 1024 ** 3,
      terabyte: 1024 ** 4,
    },
  },
};

export function convertUnit(category: keyof typeof UNIT_CATEGORIES, value: number, from: string, to: string): number | null {
  const cat = UNIT_CATEGORIES[category];
  if (!cat) return null;
  const fromMultiplier = cat.units[from];
  const toMultiplier = cat.units[to];
  if (fromMultiplier === undefined || toMultiplier === undefined) return null;
  const baseValue = value * fromMultiplier;
  return baseValue / toMultiplier;
}

export function convertTemperature(value: number, from: 'celsius' | 'fahrenheit' | 'kelvin', to: 'celsius' | 'fahrenheit' | 'kelvin'): number {
  let celsius: number;
  switch (from) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = ((value - 32) * 5) / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
  }
  switch (to) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return (celsius * 9) / 5 + 32;
    case 'kelvin':
      return celsius + 273.15;
  }
}
