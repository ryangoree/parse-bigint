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
				const [mantissaStr = '', exponentStr = '', invalidExponent] =
					n.split('e');

				// Validate input format.
				if (invalidExponent || !/^-?\d*$/.test(exponentStr)) {
					throw new Error(
						`Invalid exponent in ${input}: ${n.replace(/^[^e]+e/, '')}`,
					);
				}
				if (!/^\d+(\.\d+)?$/.test(mantissaStr)) {
					throw new Error(`Invalid number format: ${input}`);
				}

				// To handle cases like "12300e-2", the trailing zeroes are separated
				// from the integer version of the significand and used to adjust the
				// exponent since BigInt doesn't support negative exponents.
				const [integerSignificandStr = '', trailingZeroesStr = ''] = mantissaStr
					.replace('.', '')
					.split(/(?<=[1-9]+)(?=0+$)/);

				// Adjust the exponent to account for the decimal point's position and
				// any trailing zeroes that were part of the original mantissa.
				const [_, fractionStr = ''] = mantissaStr.split('.');
				const adjustedExponent =
					BigInt(exponentStr) -
					BigInt(fractionStr.length) +
					BigInt(trailingZeroesStr.length);

				// A negative adjusted exponent implies a non-integer.
				if (adjustedExponent < 0) {
					const exponentNumber = Number(adjustedExponent);
					const unscaledStr = integerSignificandStr.padStart(
						Math.abs(exponentNumber) + 1,
						'0',
					);
					const integerStr = unscaledStr.slice(0, exponentNumber);
					const fractionStr = unscaledStr.slice(exponentNumber);
					throw new Error(`Invalid BigInt: ${integerStr}.${fractionStr}`);
				}

				return BigInt(integerSignificandStr) * 10n ** adjustedExponent * sign;
			}

			try {
				return BigInt(n) * sign;
			} catch {
				throw new Error(`Invalid number format: ${input}`);
			}
		}
	}
}
