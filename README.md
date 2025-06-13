# true-myth-zod

A simple integration between [True Myth](https://true-myth.js.org) and [Zod](https://zod.dev).

## Installation

This library intentionally does *not* bundle True Myth or Zod: it requires them as peer dependencies.

| package manager |                   command                  |
| --------------- | ------------------------------------------ |
| pnpm            | `pnpm install true-myth zod true-myth-zod` |
| yarn            | `yarn add true-myth zod true-myth-zod`     |
| npm             | `npm install true-myth zod true-myth-zod`  |

You must install a compatible version (pnpm and Yarn will check this for you):

|   package   | minimum version |
| ----------- | --------------- |
| `true-myth` | `9.0.0`         |
| `zod`       | `3.25.0`        |


## Usage

Write a schema with Zod, then wrap it with the `parserFor` or `asyncParserFor` functions exported by this library to produce a function that accepts unknown data and produces a True Myth `Result` (for sync parsing) or `Task` (for async parsing).

```ts
import * as z from 'zod/v4';
import { parserFor } from 'true-myth-zod';

// 1. Create the Zod schema.
const UserSchema = z.object({
  age: z.number(),
  name: z.string().optional(),
});

// 2. Wrap it with `parserFor` to create a version that produces a True Myth
//    `Result` instead of Zod's
const parseUser = parserFor(UserSchema);

const input: unknown = { age: 42, name: "Reference Guy" };

parseUser(input).match({
  Ok: (user) => {
    console.log(user.name ?? "someone", "is", user.age);
  },
  Err: (parseError) => {
    console.error(
      `could not parse data: ${input}`,
      parseError.message,
      parseError.cause,
      ...parseError.issues,
    );
  },
});
```

This library only depends on the `zod/v4/core`, so you can safely use it with either Zod or Zod Mini.
