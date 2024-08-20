import { expect, test } from 'vitest';
import { parseBigInt } from '.';

test('simple', () => {
  expect(parseBigInt('1')).toEqual(1n);
  expect(parseBigInt('1_000')).toEqual(1000n);
  expect(parseBigInt('-1_000')).toEqual(-1_000n);
  expect(parseBigInt('5,500,000,000')).toEqual(5_500_000_000n);
});

test('scientific notation', () => {
  expect(parseBigInt('1e0')).toEqual(1n);
  expect(parseBigInt('1e3')).toEqual(1_000n);
  expect(parseBigInt('1e18')).toEqual(1n * 10n ** 18n);
  expect(parseBigInt('-1e18')).toEqual(-1n * 10n ** 18n);
  expect(parseBigInt('50_000e18')).toEqual(50_000n * 10n ** 18n);

  // decimal point
  expect(parseBigInt('1.0e1')).toEqual(10n);
  expect(parseBigInt('1.1e18')).toEqual(11n * 10n ** 17n);
  expect(parseBigInt('333_333.555_555e18')).toEqual(
    333_333_555_555n * 10n ** 12n
  );
});

test('base prefixes', () => {
  // binary notation
  expect(parseBigInt('0b1')).toEqual(1n);
  expect(parseBigInt('0b10')).toEqual(2n);
  expect(parseBigInt('0b11')).toEqual(3n);
  expect(parseBigInt('0b1111_1111')).toEqual(255n);
  expect(parseBigInt('-0b1111_1111')).toEqual(-255n);

  // octal notation
  expect(parseBigInt('0o1')).toEqual(1n);
  expect(parseBigInt('0o10')).toEqual(8n);
  expect(parseBigInt('0o11')).toEqual(9n);
  expect(parseBigInt('0o777')).toEqual(511n);
  expect(parseBigInt('-0o777')).toEqual(-511n);

  // hex notation
  expect(parseBigInt('0x1')).toEqual(1n);
  expect(parseBigInt('0x10')).toEqual(16n);
  expect(parseBigInt('0x11')).toEqual(17n);
  expect(parseBigInt('0xff')).toEqual(255n);
  expect(parseBigInt('-0xff')).toEqual(-255n);
});
