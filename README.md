# `@slev/todo` - Your Friendly Reminder (and API Spammer)

Tired of those pesky TODO comments cluttering your code? We are too! `@slev/todo` is here to revolutionize your procrastination workflow.

### About

`@slev/todo` is a (somewhat) serious JS module designed for developers who love to leave TODOs everywhere (and then forget about them). With todo, you can:

- Write your TODOs as actual code! That's right, no more hiding them in comments.
- Spam your favorite API (or a mock function) every time a TODO is encountered during code execution.
- Guilt-trip yourself (and your team) into actually completing those TODOs.
- Literally throw an error if your todo's are past their due date.

### Installation

Visit https://jsr.io/@slev/todo for instructions!

### Usage

Import and Initialize:

```
  import { init, todo } from "@slev/todo";

  // Option 1: Spam a real API
  init({
    url: "https://your-api-endpoint.com/todo-nagger", // Replace with your actual API endpoint
    middleware: [
      // Add any middleware functions to transform the TODO context before sending
    ],
  });

  // Option 2: Mock API calls (perfect for testing)
  init({
    callFunction: async (context) => {
      console.log("TODO encountered:", context);
      return true; // Or false if you want to simulate a failed API call
    },
  });
```

**Replace those TODO comments with todo calls**

Before

```
function getRandomNumber() {
  // Todo: Make actually random
  return 7;
}
```

After

```
function getRandomNumber() {

  let randomNumber;
  todo(() => {
    // Your actual TODO code goes here
    randomNumber = 7;
  }, {
    todo: "Implement actual randomness",
    // Add any additional context you want to send along
  });

  return randomNumber;
}
```

Now, every time getRandomNumber is called and the todo block is reached, `@slev/todo` will

1. Execute your TODO code.
2. Send a POST request to your specified API endpoint (or call your mock function) with the TODO details and any additional context you provided.

### Due dates

Set due dates for your todos! Better yet, cause the code to ERROR out if it is past the due date.

**Hold yourself accountable.**

```
function calculateSum(a, b) {

  let sum;
  todo(() => {
    sum = Math.max(a, b);
  }, {
    todo: "I think this might be wrong",
    dueDate: new Date("2021-04-21"),
    dueDateBehaviour: "error" // (defaults to ignore)
  });

  return sum;
}
```

### Embrace the Annoyance!

`@slev/todo` is designed to be intentionally annoying. By encapsulating TODO code within the `todo` function and spamming your API/mock function, we aim to create a sense of urgency and encourage you to address those lingering TODOs head-on. The encapsultion will force you to want to remove the todo. Perfection!

### Pro Tips

- Set up Slack notifications for your API endpoint to get real-time TODO alerts in your team's channel.
- Use the middleware option to add custom data transformations or logging to your TODO context.
- Embrace the guilt! The more your API gets spammed, the closer you are to achieving TODO-less nirvana.

### Disclaimer

`@slev/todo` is a tool for the brave. Use it wisely (and responsibly). We are not responsible for any strained relationships with your API provider or excessive Slack notifications.

### Contributing

We welcome contributions! If you have any ideas, bug fixes, or feature requests, please open an issue or submit a pull request.

Happy TODO-ing!

# License

This project is licensed under the MIT License.
