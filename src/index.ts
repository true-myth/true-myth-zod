import * as z from "zod/v4/core";
import { task, type Task, result, type Result } from "true-myth";

export function parserFor<Schema extends z.$ZodType>(
  schema: Schema,
): (data: unknown) => Result<z.output<Schema>, z.$ZodError> {
  return (data) => {
    const parseResult = z.safeParse(schema, data);
    return parseResult.success
      ? result.ok(parseResult.data)
      : result.err(parseResult.error);
  };
}

export function asyncParserFor<S extends z.$ZodType>(
  schema: S,
): (data: unknown) => Task<z.output<S>, z.$ZodError> {
  return (data) => {
    return task
      .fromPromise(z.safeParseAsync(schema, data), (cause: unknown): never => {
        /* v8 ignore next 3 */ // This should be impossible!
        throw new Error("Bug in Zod's safeParseAsync: it should never throw!", {
          cause,
        });
      })
      .andThen((parseResult) =>
        parseResult.success
          ? task.resolve(parseResult.data)
          : task.reject(parseResult.error),
      );
  };
}
