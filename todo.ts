type TodoContext = Record<string, unknown> & {
  todo: string;
  dueDate?: Date;
  dueDateBehaviour?: "ignore" | "warn" | "error"; // Default is "ignore"
};

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
 * Create a todo, the callback is immediately invoked and a side effect is recorded.
 * If the dueDate is set and the dueDateBehaviour is not "ignore", the dueDate is checked
 * and if the dueDate is in the past, an error or warning is thrown.
 */
export function todo(cb: () => void, context: TodoContext) {
  if (!initCalled) {
    throw new Error("init function not called");
  }

  if (context.dueDate && context.dueDateBehaviour !== "ignore") {
    if (Date.now() > context.dueDate.getTime()) {
      if (context.dueDateBehaviour === "error") {
        throw new Error(`${context.todo} is overdue`);
      } else if (context.dueDateBehaviour === "warn") {
        console.warn(`${context.todo} is overdue`);
      }
    }
  }

  cb();

  if (typeof recordTodoCalled === "function") {
    recordTodoCalled(context);
  }
}
