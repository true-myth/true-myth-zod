import { type Result, result, type Task } from 'true-myth';
import { unwrapErr } from 'true-myth/test-support';
import { describe, expect, expectTypeOf, test } from 'vitest';
import * as z from 'zod/v4/mini';

import { parserFor, asyncParserFor } from 'true-myth-zod';

describe('parserFor', () => {
  interface User {
    name?: string | undefined;
    age: number;
  }

  const UserSchema = z.object({
    name: z.optional(z.string()),
    age: z.number()
  });


  const parse = parserFor(UserSchema);
  expectTypeOf(parse).toEqualTypeOf<(data: unknown) => Result<User, z.core.$ZodError>>();

  test('with a valid user', () => {
    expect(parse({ age: 38 })).toEqual(result.ok({ age: 38 }));

    const withName = parse({ age: 38, name: "Chris" });
    expect(withName).toEqual(result.ok({ age: 38, name: "Chris" }));
    expectTypeOf(withName).toEqualTypeOf<Result<User, z.core.$ZodError>>();
  });

  test('with an invalid user', () => {
    const theResult = parse({});
    expect(theResult.isErr).toBe(true);
    const theError = unwrapErr(theResult);
    expect(theError.issues.length).not.toBe(0);
  });
});

describe('asyncParserFor', () => {
  interface User {
    name?: string | undefined;
    age: number;
  }

  const UserSchema = z.object({
    name: z.optional(z.string()),
    // Define an async refinement so we have . The actual value
    age: z.number().check(z.refine(async (val) => val >= 0))
  });


  const parse = asyncParserFor(UserSchema);
  expectTypeOf(parse).toEqualTypeOf<(data: unknown) => Task<User, z.core.$ZodError>>();

  test('with a valid user', async () => {
    expect(await parse({ age: 38 })).toEqual(result.ok({ age: 38 }));

    const withName = parse({ age: 38, name: "Chris" });
    expectTypeOf(withName).toEqualTypeOf<Task<User, z.core.$ZodError>>();
    const theResult = await withName;
    expect(theResult).toEqual(result.ok({ age: 38, name: "Chris" }));
  });

  test('with an invalid user', async () => {
    const theResult = await parse({});
    expect(theResult.isErr).toBe(true);
    const theError = unwrapErr(theResult);
    expect(theError.issues.length).not.toBe(0);
  });
})
