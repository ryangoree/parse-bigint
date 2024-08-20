# parse-bigint

A single function, `parseBigInt`, that takes a number-like value and returns a
BigInt with support for scientific notation, underscores, commas, and base
prefixes.

## Installation

```sh
npm install parse-bigint
```

## Example

```ts
import { parseBigInt } from 'parse-bigint';

parseBigInt(10); // 10n
parseBigInt('10'); // 10n
parseBigInt('10.123e3'); // 10123n
parseBigInt('10_123'); // 10123n
parseBigInt('10,123'); // 10123n
parseBigInt('0x10'); // 16n
parseBigInt('0b10'); // 2n
parseBigInt('0o10'); // 8n
```
