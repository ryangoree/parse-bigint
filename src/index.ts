/**
 * Parses a number-like value into a BigInt with support for scientific
 * notation, underscores, commas, and base prefixes.
 *
 * @example
 * ```ts
 * parseBigInt(10); // 10n
 * parseBigInt('10'); // 10n
 * parseBigInt('10.123e3'); // 10123n
 * parseBigInt('10_123'); // 10123n
 * parseBigInt('10,123'); // 10123n
 * parseBigInt('0x10'); // 16n
 * parseBigInt('0b10'); // 2n
 * parseBigInt('0o10'); // 8n
 * ```
 */
export function parseBigInt(x: bigint | number | string): bigint {
  switch (typeof x) {
    case 'bigint':
      return x;

    case 'number':
      return BigInt(x);

    case 'string':
      x = x.trim().toLowerCase().replace(/(_|,)/g, '');
      let sign = 1n;
      if (x.startsWith('-')) {
        sign = -1n;
        x = x.slice(1);
      }
      if (x.startsWith('+')) {
        x = x.slice(1);
      }
      if (x.startsWith('0x') || x.startsWith('0b') || x.startsWith('0o')) {
        return BigInt(x) * sign;
      }
      if (x.includes('e')) {
        let [mantissaStr, exponentStr] = x.split('e');
        const exponent = BigInt(exponentStr);
        const [_, fractionStr] = mantissaStr.split('.');
        let scaleFactor = exponent - BigInt(fractionStr?.length || 0);
        if (scaleFactor < 0) {
          throw new Error(
            `Invalid BigInt: Decimal precision (.${fractionStr}) exceeds exponent (${exponent}): ${x}`
          );
        }

        return BigInt(mantissaStr.replace('.', '')) * 10n ** scaleFactor * sign;
      }
      return BigInt(x) * sign;
  }
}
