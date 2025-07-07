import assert from 'node:assert';
import test, { suite } from 'node:test';
import { parseBigInt } from './index.ts';

test('simple', () => {
  assert.strictEqual(parseBigInt('1'), 1n);
  assert.strictEqual(parseBigInt('-1'), -1n);
  assert.strictEqual(parseBigInt('1_000'), 1000n);
  assert.strictEqual(parseBigInt('-1_000'), -1_000n);
  assert.strictEqual(parseBigInt('5,500,000,000'), 5_500_000_000n);
  assert.strictEqual(parseBigInt('-5,500,000,000'), -5_500_000_000n);
});

suite('scientific notation', () => {
  test('integers', () => {
    assert.strictEqual(parseBigInt('1e0'), 1n);
    assert.strictEqual(parseBigInt('1e3'), 1_000n);
    assert.strictEqual(parseBigInt('1e18'), 1n * 10n ** 18n);
    assert.strictEqual(parseBigInt('-1e18'), -1n * 10n ** 18n);
    assert.strictEqual(parseBigInt('50,000e18'), 50_000n * 10n ** 18n);
    assert.strictEqual(parseBigInt('-50,000e18'), -50_000n * 10n ** 18n);
    assert.strictEqual(parseBigInt('50_000e18'), 50_000n * 10n ** 18n);
    assert.strictEqual(parseBigInt('-50_000e18'), -50_000n * 10n ** 18n);
  });

  test('decimal point', () => {
    assert.strictEqual(parseBigInt('1.0e1'), 10n);
    assert.strictEqual(parseBigInt('1.1e18'), 11n * 10n ** 17n);
    assert.strictEqual(
      parseBigInt('333_333.555_555e18'),
      333_333_555_555n * 10n ** 12n,
    );
    assert.strictEqual(
      parseBigInt('-333_333.555_555e18'),
      -333_333_555_555n * 10n ** 12n,
    );
  });

  test('negative exponent', () => {
    assert.throws(() => parseBigInt('1e-1'));
    assert.strictEqual(parseBigInt('10e-1'), 1n);
    assert.strictEqual(parseBigInt('-1000e-2'), -10n);
    assert.strictEqual(parseBigInt('-10110e-2'), -101n);
  });
});

suite('base prefixes', () => {
  test('binary', () => {
    assert.strictEqual(parseBigInt('0b1'), 1n);
    assert.strictEqual(parseBigInt('0b10'), 2n);
    assert.strictEqual(parseBigInt('0b11'), 3n);
    assert.strictEqual(parseBigInt('0b1111_1111'), 255n);
    assert.strictEqual(parseBigInt('-0b1111_1111'), -255n);
  });

  test('octal', () => {
    assert.strictEqual(parseBigInt('0o1'), 1n);
    assert.strictEqual(parseBigInt('0o10'), 8n);
    assert.strictEqual(parseBigInt('0o11'), 9n);
    assert.strictEqual(parseBigInt('0o777'), 511n);
    assert.strictEqual(parseBigInt('-0o777'), -511n);
  });

  test('hex', () => {
    assert.strictEqual(parseBigInt('0x1'), 1n);
    assert.strictEqual(parseBigInt('0x10'), 16n);
    assert.strictEqual(parseBigInt('0x11'), 17n);
    assert.strictEqual(parseBigInt('0xff'), 255n);
    assert.strictEqual(parseBigInt('-0xff'), -255n);
  });
});
