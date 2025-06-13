import { test } from 'vitest';

import * as z from 'zod/v4';
import { parserFor } from 'true-myth-zod';

test('the README example code', () => {
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
});
