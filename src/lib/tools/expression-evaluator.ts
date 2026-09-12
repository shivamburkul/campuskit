/**
 * A small recursive-descent expression evaluator for the scientific
 * calculator. Deliberately not using eval()/Function() on arbitrary
 * strings — this parses a known grammar (numbers, + - * / ^, unary minus,
 * parentheses, factorial, named functions, and the constants pi/e) so it
 * can support correct operator precedence and nested parentheses like a
 * real calculator, while staying fully self-contained and predictable.
 */

export type AngleMode = 'deg' | 'rad';

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log', 'ln', 'sqrt', 'cbrt', 'abs',
]);

type TokenType = 'number' | 'ident' | 'op' | 'lparen' | 'rparen' | 'comma' | 'bang';
interface Token {
  type: TokenType;
  value: string;
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i]!;
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let num = ch;
      i++;
      while (i < input.length && /[0-9.]/.test(input[i]!)) { num += input[i]; i++; }
      tokens.push({ type: 'number', value: num });
      continue;
    }
    if (/[a-zA-Z]/.test(ch)) {
      let ident = ch;
      i++;
      while (i < input.length && /[a-zA-Z]/.test(input[i]!)) { ident += input[i]; i++; }
      tokens.push({ type: 'ident', value: ident });
      continue;
    }
    if (ch === '(') { tokens.push({ type: 'lparen', value: ch }); i++; continue; }
    if (ch === ')') { tokens.push({ type: 'rparen', value: ch }); i++; continue; }
    if (ch === ',') { tokens.push({ type: 'comma', value: ch }); i++; continue; }
    if (ch === '!') { tokens.push({ type: 'bang', value: ch }); i++; continue; }
    if ('+-*/^%'.includes(ch)) { tokens.push({ type: 'op', value: ch }); i++; continue; }
    if (ch === '×') { tokens.push({ type: 'op', value: '*' }); i++; continue; }
    if (ch === '÷') { tokens.push({ type: 'op', value: '/' }); i++; continue; }
    throw new Error(`Unexpected character: "${ch}"`);
  }
  return tokens;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires a non-negative integer.');
  if (n > 170) throw new Error('Number too large for factorial.');
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

class Parser {
  private tokens: Token[];
  private pos = 0;
  private angleMode: AngleMode;

  constructor(tokens: Token[], angleMode: AngleMode) {
    this.tokens = tokens;
    this.angleMode = angleMode;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }
  private next(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new Error('Unexpected end of expression.');
    this.pos++;
    return t;
  }

  parse(): number {
    if (this.tokens.length === 0) return 0;
    const result = this.parseExpression();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token: "${this.peek()!.value}"`);
    }
    return result;
  }

  // Precedence, lowest to highest: + - | * / | unary - | ^ (right-assoc) | postfix ! | atoms
  private parseExpression(): number {
    let left = this.parseTerm();
    while (this.peek()?.type === 'op' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.next().value;
      const right = this.parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  private parseTerm(): number {
    let left = this.parsePower();
    while (this.peek()?.type === 'op' && (this.peek()!.value === '*' || this.peek()!.value === '/' || this.peek()!.value === '%')) {
      const op = this.next().value;
      const right = this.parsePower();
      if (op === '*') left = left * right;
      else if (op === '/') {
        if (right === 0) throw new Error('Cannot divide by zero.');
        left = left / right;
      } else {
        left = left % right;
      }
    }
    return left;
  }

  private parsePower(): number {
    const left = this.parseUnary();
    if (this.peek()?.type === 'op' && this.peek()!.value === '^') {
      this.next();
      const right = this.parsePower(); // right-associative
      return Math.pow(left, right);
    }
    return left;
  }

  private parseUnary(): number {
    if (this.peek()?.type === 'op' && this.peek()!.value === '-') {
      this.next();
      return -this.parseUnary();
    }
    if (this.peek()?.type === 'op' && this.peek()!.value === '+') {
      this.next();
      return this.parseUnary();
    }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let value = this.parseAtom();
    while (this.peek()?.type === 'bang') {
      this.next();
      value = factorial(value);
    }
    return value;
  }

  private parseAtom(): number {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of expression.');

    if (token.type === 'number') {
      this.next();
      return parseFloat(token.value);
    }

    if (token.type === 'lparen') {
      this.next();
      const value = this.parseExpression();
      if (this.peek()?.type !== 'rparen') throw new Error('Missing closing parenthesis.');
      this.next();
      return value;
    }

    if (token.type === 'ident') {
      this.next();
      const name = token.value.toLowerCase();

      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;
      if (name === 'ans') return 0; // substituted by caller before parsing, fallback only

      if (FUNCTIONS.has(name)) {
        if (this.peek()?.type !== 'lparen') throw new Error(`Expected "(" after ${name}`);
        this.next();
        const arg = this.parseExpression();
        if (this.peek()?.type !== 'rparen') throw new Error('Missing closing parenthesis.');
        this.next();
        return this.applyFunction(name, arg);
      }

      throw new Error(`Unknown identifier: "${token.value}"`);
    }

    throw new Error(`Unexpected token: "${token.value}"`);
  }

  private toRadians(x: number): number {
    return this.angleMode === 'deg' ? (x * Math.PI) / 180 : x;
  }
  private fromRadians(x: number): number {
    return this.angleMode === 'deg' ? (x * 180) / Math.PI : x;
  }

  private applyFunction(name: string, arg: number): number {
    switch (name) {
      case 'sin': return Math.sin(this.toRadians(arg));
      case 'cos': return Math.cos(this.toRadians(arg));
      case 'tan': return Math.tan(this.toRadians(arg));
      case 'asin': return this.fromRadians(Math.asin(arg));
      case 'acos': return this.fromRadians(Math.acos(arg));
      case 'atan': return this.fromRadians(Math.atan(arg));
      case 'sinh': return Math.sinh(arg);
      case 'cosh': return Math.cosh(arg);
      case 'tanh': return Math.tanh(arg);
      case 'log': return Math.log10(arg);
      case 'ln': return Math.log(arg);
      case 'sqrt': return Math.sqrt(arg);
      case 'cbrt': return Math.cbrt(arg);
      case 'abs': return Math.abs(arg);
      default: throw new Error(`Unknown function: ${name}`);
    }
  }
}

/** Evaluates a calculator expression string, e.g. "sin(30) + 2^3 * (1 + ans)". */
export function evaluateExpression(expression: string, angleMode: AngleMode, ans: number): number {
  // Substitute "ans" with the literal previous answer before tokenizing —
  // simplest correct way to support it without threading state through the parser.
  const withAns = expression.replace(/\bans\b/gi, `(${ans})`);
  const tokens = tokenize(withAns);
  const parser = new Parser(tokens, angleMode);
  const result = parser.parse();
  if (!Number.isFinite(result)) throw new Error('Result is not a finite number.');
  return result;
}
