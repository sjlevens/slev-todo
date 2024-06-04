type TodoContext = Record<string, unknown> & { todo: string };

type Init = {
  ENV?: string;
  url?: string;
  middleware?: ((tc: TodoContext) => TodoContext)[];
  callFunction?: (tc: TodoContext) => Promise<boolean>;
};

let initCalled = false;

let recordTodoCalled: ((ctx: TodoContext) => Promise<boolean>) | null = null;

/**
 *
 * @param props
 * @returns
 *
 * Initialize the todo library
 */
export function init(props: Init) {
  if (initCalled) {
    return;
  }

  initCalled = true;

  const { url, middleware = [], callFunction } = props;

  recordTodoCalled = async (context: TodoContext) => {
    try {
      const finalContext = middleware.reduce((acc, curr) => {
        return curr(acc);
      }, context);

      if (url) {
        const body: ReadableStream<Uint8Array> = new ReadableStream({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode(JSON.stringify(finalContext))
            );
            controller.close();
          },
        });

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const request = new Request(url, {
          headers,
          body,
          method: "POST",
        });

        const response = await fetch(request);
        return response.ok;
      }

      if (callFunction) {
        return callFunction(finalContext);
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
}

/**
 *
 * @param cb
 * @param context
 *
 * Create a todo, the callback is immediately invoked and a side effect is recorded
 */
export function todo(cb: () => void, context: TodoContext) {
  cb();

  if (!initCalled) {
    throw new Error("init function not called");
  }

  if (typeof recordTodoCalled === "function") {
    recordTodoCalled(context);
  }
}
