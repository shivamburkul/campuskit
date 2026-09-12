import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson, validateJson, decodeBase64, generateUuidV4, decodeJwt, numberBaseConvert, hexToRgb, rgbToHex } from '../src/lib/tools/dev';

describe('formatJson', () => {
  it('formats valid JSON', () => {
    const result = formatJson('{"a":1}');
    expect(result.error).toBeNull();
    expect(result.output).toContain('"a": 1');
  });
  it('reports invalid JSON', () => {
    const result = formatJson('{a:1}');
    expect(result.error).not.toBeNull();
  });
});

describe('minifyJson / validateJson', () => {
  it('minifies valid JSON', () => {
    expect(minifyJson('{ "a" : 1 }').output).toBe('{"a":1}');
  });
  it('validates malformed JSON as invalid', () => {
    expect(validateJson('not json').valid).toBe(false);
  });
});

describe('base64', () => {
  it('round-trips text via decode of a known value', () => {
    const result = decodeBase64('aGVsbG8=');
    expect(result.output).toBe('hello');
    expect(result.error).toBeNull();
  });
  it('reports error for invalid base64', () => {
    const result = decodeBase64('not valid base64 !!!');
    expect(result.error).not.toBeNull();
  });
});

describe('generateUuidV4', () => {
  it('produces a valid v4 UUID shape', () => {
    const uuid = generateUuidV4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});

describe('decodeJwt', () => {
  it('rejects tokens without 3 parts', () => {
    const result = decodeJwt('not.a.jwt.token.here');
    expect(result.error).not.toBeNull();
  });
});

describe('numberBaseConvert', () => {
  it('converts binary to decimal', () => {
    expect(numberBaseConvert('1010', 2, 10).output).toBe('10');
  });
  it('converts decimal to hex', () => {
    expect(numberBaseConvert('255', 10, 16).output).toBe('FF');
  });
  it('errors on invalid digits for the base', () => {
    expect(numberBaseConvert('129', 2, 10).error).not.toBeNull();
  });
});

describe('color conversions', () => {
  it('converts hex to rgb', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });
  it('returns null for invalid hex', () => {
    expect(hexToRgb('notacolor')).toBeNull();
  });
  it('round-trips rgb to hex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
  });
});
