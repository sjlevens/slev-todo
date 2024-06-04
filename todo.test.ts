import { init, todo } from "./todo.ts";
import { assert, assertEquals } from "jsr:@std/assert";

Deno.test("todo callFunction", async () => {
  let callFunctionCalled = false;
  let callbackCalled = 0;

  init({
    callFunction: () =>
      new Promise((resolve) => {
        callFunctionCalled = true;
        resolve(true);
      }),
  });

  let getRandomNumber = Math.random;

  todo(
    () => {
      // Guaranteed to be random I rolled a 7
      getRandomNumber = () => 7;

      const randomNumber = getRandomNumber();
      callbackCalled = randomNumber;
    },
    {
      some: "context",
      todo: "please fix me, this is not how random numbers work",
    }
  );

  assertEquals(callbackCalled, 7);

  await new Promise((resolve) => setTimeout(resolve, 10));
  assert(callFunctionCalled);
});

Deno.test("todo middleware", () => {
  let middlewareCalled = false;
  let callbackCalled = 0;

  init({
    middleware: [
      (context) => {
        middlewareCalled = true;
        return context;
      },
    ],
  });

  todo(
    () => {
      // Guaranteed to be random I rolled a 7
      const getRandomNumber = () => 7;

      const randomNumber = getRandomNumber();
      callbackCalled = randomNumber;
    },
    {
      some: "context",
      todo: "please fix me, this is not how random numbers work",
    }
  );

  assertEquals(callbackCalled, 7);
  assert(middlewareCalled);
});

Deno.test("todo url", () => {
  let fetchCalled = false;

  const originalFetch = globalThis.fetch;

  globalThis.fetch = (() => {
    fetchCalled = true;
    return {
      ok: true,
    };
  }) as unknown as typeof globalThis.fetch;

  let callbackCalled = 0;

  init({
    url: "http://localhost:8080",
  });

  todo(
    () => {
      // Guaranteed to be random I rolled a 7
      const getRandomNumber = () => 7;

      const randomNumber = getRandomNumber();
      callbackCalled = randomNumber;
    },
    {
      some: "context",
      todo: "please fix me, this is not how random numbers work",
    }
  );

  assertEquals(callbackCalled, 7);
  assert(fetchCalled);

  globalThis.fetch = originalFetch;
});
