import { describe, expect, it } from 'bun:test';
import { parseBigInt } from './index.ts';

it('parses simple integer strings', () => {
  expect(parseBigInt('123')).toStrictEqual(123n);
  expect(parseBigInt('-123')).toStrictEqual(-123n);
  expect(parseBigInt('+123')).toStrictEqual(123n);
});

it('parses single unary operators', () => {
  expect(parseBigInt('-123')).toStrictEqual(-123n);
  expect(parseBigInt('+123')).toStrictEqual(123n);
});

it('parses multiple unary operators', () => {
  expect(parseBigInt('-+123')).toStrictEqual(-123n);
  expect(parseBigInt('+-123')).toStrictEqual(-123n);
  expect(parseBigInt('-+-+123')).toStrictEqual(123n);
  expect(parseBigInt('+-+-123')).toStrictEqual(123n);
  expect(parseBigInt('-+-+-123')).toStrictEqual(-123n);
  expect(parseBigInt('+-+-+123')).toStrictEqual(123n);
  expect(parseBigInt('-+-+-+123')).toStrictEqual(-123n);
  expect(parseBigInt('+-+-+-123')).toStrictEqual(-123n);
});

it('ignores underscores', () => {
  expect(parseBigInt('1_234')).toStrictEqual(1_234n);
  expect(parseBigInt('-1_234')).toStrictEqual(-1_234n);
});

it('ignores commas', () => {
  expect(parseBigInt('1,234')).toStrictEqual(1_234n);
  expect(parseBigInt('-1,234')).toStrictEqual(-1_234n);
});

describe('scientific notation', () => {
  it('parses integer strings', () => {
    expect(parseBigInt('1e0')).toStrictEqual(1n);
    expect(parseBigInt('1e3')).toStrictEqual(1_000n);
    expect(parseBigInt('1e18')).toStrictEqual(1n * 10n ** 18n);
    expect(parseBigInt('-1e18')).toStrictEqual(-1n * 10n ** 18n);
    expect(parseBigInt('50,000e18')).toStrictEqual(50_000n * 10n ** 18n);
    expect(parseBigInt('-50,000e18')).toStrictEqual(-50_000n * 10n ** 18n);
    expect(parseBigInt('50_000e18')).toStrictEqual(50_000n * 10n ** 18n);
    expect(parseBigInt('-50_000e18')).toStrictEqual(-50_000n * 10n ** 18n);
  });

  it('parses decimal point strings', () => {
    expect(parseBigInt('1.0e1')).toStrictEqual(10n);
    expect(parseBigInt('1.1e18')).toStrictEqual(11n * 10n ** 17n);
    expect(parseBigInt('333_333.555_555e18')).toStrictEqual(
      333_333_555_555n * 10n ** 12n,
    );
    expect(parseBigInt('-333_333.555_555e18')).toStrictEqual(
      -333_333_555_555n * 10n ** 12n,
    );
  });

  it('parses negative exponent strings', () => {
    expect(() => parseBigInt('1e-1')).toThrow();
    expect(parseBigInt('10e-1')).toStrictEqual(1n);
    expect(parseBigInt('-1000e-2')).toStrictEqual(-10n);
    expect(parseBigInt('-10100e-2')).toStrictEqual(-101n);
  });
});

describe('base prefixes', () => {
  it('parses strings prefixed with "0b" as binary', () => {
    expect(parseBigInt('0b1')).toStrictEqual(1n);
    expect(parseBigInt('0b10')).toStrictEqual(2n);
    expect(parseBigInt('0b11')).toStrictEqual(3n);
    expect(parseBigInt('0b1111_1111')).toStrictEqual(255n);
    expect(parseBigInt('-0b1111_1111')).toStrictEqual(-255n);
  });

  it('parses strings prefixed with "0o" as octal', () => {
    expect(parseBigInt('0o1')).toStrictEqual(1n);
    expect(parseBigInt('0o10')).toStrictEqual(8n);
    expect(parseBigInt('0o11')).toStrictEqual(9n);
    expect(parseBigInt('0o777')).toStrictEqual(511n);
    expect(parseBigInt('-0o777')).toStrictEqual(-511n);
  });

  it('parses strings prefixed with "0x" as hex', () => {
    expect(parseBigInt('0x1')).toStrictEqual(1n);
    expect(parseBigInt('0x10')).toStrictEqual(16n);
    expect(parseBigInt('0x11')).toStrictEqual(17n);
    expect(parseBigInt('0xff')).toStrictEqual(255n);
    expect(parseBigInt('-0xff')).toStrictEqual(-255n);
  });
});
