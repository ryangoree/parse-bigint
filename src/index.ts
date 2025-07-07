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
export function parseBigInt(input: bigint | number | string): bigint {
  switch (typeof input) {
    case 'bigint':
      return input;

    case 'number':
      return BigInt(input);

    case 'string': {
      let n = input.trim().toLowerCase().replace(/(_|,)/g, '');

      let sign = 1n;
      if (n.startsWith('-')) {
        sign = -1n;
        n = n.slice(1);
      }
      if (n.startsWith('+')) {
        n = n.slice(1);
      }

      // Handle scientific notation.
      if (n.includes('e') && !n.startsWith('0x')) {
        let [mantissaStr = '', exponentStr = '', invalidExponent] =
          n.split('e');
        const [integerStr, fractionStr = '', invalidFraction] =
          mantissaStr.split('.');

        if (invalidExponent || invalidFraction) {
          throw new Error(`Invalid number format: ${input}`);
        }

        const adjustedExponent = +exponentStr - fractionStr.length;
        mantissaStr = `${integerStr}${fractionStr}`;

        if (adjustedExponent < 0) {
          const fractionStr = mantissaStr.slice(adjustedExponent);
          if (+fractionStr !== 0) {
            const integerStr = mantissaStr
              .padStart(Math.abs(adjustedExponent) + 1, '0')
              .slice(0, adjustedExponent);
            throw new Error(
              `Invalid BigInt: ${integerStr}.${fractionStr.replace(/0+$/, '')}`,
            );
          }
          return BigInt(mantissaStr.slice(0, adjustedExponent)) * sign;
        }

        try {
          return BigInt(mantissaStr) * 10n ** BigInt(adjustedExponent) * sign;
        } catch {
          throw new Error(`Invalid number format: ${input}`);
        }
      }

      try {
        return BigInt(n) * sign;
      } catch {
        throw new Error(`Invalid number format: ${input}`);
      }
    }
  }
}
