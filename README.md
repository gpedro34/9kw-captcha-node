# 9kw

This is an api wrapper for the 9kw captcha solver service. An Api Key is needed, generate using the 9kw website.

- [Documentation](https://gpedro34.github.io/9kw-captcha-node/module.exports.html)

## Installation

node:

```sh
npm install 9kw

```

## Promises - Async/Await

**NOTE: All methods return Promises.**

```js
const api9kw = require("9kw");
const captcha = new api9kw(9KW_API_KEY);

(async () => {
  try {
    // Submit the image file with the captcha
    await captcha.async.submit("./captcha.png");

    // you can also submit using a siteKey
    // await captcha.async.submit(SITE_KEY, SITE_URL);

    // you can also submit using a url
    // await captcha.async.submitUrl(url);

    // you can also submit using a base64 string
    // await captcha.async.submitBase64(data);

    // Get the solution of the captcha with a timeout of 40 seconds (optional)
    // this means that the callback will be called when the captcha is solved
    // usually is solved under 30s (default timeout is 30 seconds)
    await captcha.async.getSolutionLoop(captchaID, 40);

    // Tell 9kw the solution was correct or not
    await captcha.async.isCorrect(captchaID, true);

    // Get the 9kw server check info
    await captcha.async.serverCheck();

    // Get your account balance (credits)
    await captcha.async.getBalance();
  } catch (err) {
    console.error(err);
  }
})();
```

## Callbacks

**NOTE: All methods are asynchronous. Use the callbacks correctly.**

```js
const api9kw = require("9kw");
const captcha = new api9kw(9KW_API_KEY);

// Submit the captcha, you can also submit using an url or base64 string
// .submitUrl(url, cb) or .submitBase64(data, cb) methods
captcha.submit("./captcha.png", (err, newID) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Captcha uploaded!: " + captchaID);
  // Next step is to get the solution of the uploaded captcha using the new captchaID
});

// you can also submit using a siteKey
// captcha.submit(
//   SITE_KEY,
//   (err, newID) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log("Captcha uploaded!: " + captchaID);
//     // Next step is to get the solution of the uploaded captcha using the new captchaID
//   },
//   SITE_URL
// );

// you can also submit using a url
// captcha.submitUrl(url, (err, newID) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Captcha uploaded!: " + captchaID);
//   // Next step is to get the solution of the uploaded captcha using the new captchaID
// });

// you can also submit using a base64 string
// captcha.submitBase64(data, (err, newID) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Captcha uploaded!: " + captchaID);
//   // Next step is to get the solution of the uploaded captcha using the new captchaID
// });

// Get the solution of the captcha with a timeout of 40 seconds (optional)
// this means that the callback will be called when the captcha is solved
// usually is solved under 30s (default timeout is 30 seconds)
captcha.getSolutionLoop(captchaID, 40, (err, solution) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Solution: " + solution);
});

// Tell 9kw the solution was correct or not
captcha.isCorrect(captchaID, true);

// Get the 9kw server check info
captcha.serverCheck((err, serverInfo) => {
  console.log(serverInfo);
});

// Get your account balance (credits)
captcha.getBalance((err, balance) => {
  console.log(balance);
});
```

## Development

### Linting and Generating Docs

```
npm run flow
```

### Tests

In order to run the tests, create a .env file as .env.default and put your account details in the correct ENV variables, then run:

```sh
npm run test
```

## Credits

This project is a fork of [iamfreee/9kw_node](https://github.com/iamfreee/9kw_node.git)
