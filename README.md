# 1. 9kw

This is an api wrapper for the 9kw captcha solver service. An Api Key is needed, generate using the 9kw website.

- [9kw.eu](https://www.9kw.eu/?r=139389)
- [Library Documentation](https://gpedro34.github.io/9kw-captcha-node/module.exports.html)

## 1.1. Installation

node:

```sh
npm install 9kw-captcha-node

```

This library supports environment variables to pass parameters like API Key:

| ENV variable           | Type   | Description                                                |
| ---------------------- | ------ | ---------------------------------------------------------- |
| CAPTCHA_API_KEY_9KW    | String | API Key                                                    |
| CAPTCHA_SOURCE_9KW     | String | 9kw Source (app indicator)                                 |
| CAPTCHA_OLD_SOURCE_9KW | String | 9kw Old Source (indicator for captcha type)                |
| CAPTCHA_PRIO_9KW       | Number | 9kw default priority                                       |
| CAPTCHA_DEBUG_9KW      | Number | Don't spend credits and get fake solutions. For testing... |

In alternative you can pass it as parameters when instantiating the API constructor

## 1.2. Promises - Async/Await

```js
const Api9kw = require("9kw-captcha-node");
const api = new Api9kw(/* You can pass parameters here or just use the ENV vars */);

(async () => {
  try {
    // Get the balance of credits from 9kw
    const balance = await api.asyncGetBalance();
    console.log(`BALANCE: ${balance} credits`);

    // Submit a local image file with the captcha
    // const captchaId = await api.asyncSubmitFile(config.pathToFile);

    // Submit using a Image Base 64 of the captha
    // const captchaId = await api.asyncSubmitBase64(config.image_base64);

    // Submit using a Image URL of the captha
    // const captchaId = await api.asyncSubmitUrl(config.image_url);

    // Submit CaptchaV2 (using a siteKey + siteUrl)
    // CaptchaV2 will need to be solved by someone in real time
    //   so using the priority becomes important if you want faster captchas
    //   300 seconds (with 0 prio) is a reasonable number so you don't miss solved captchas
    //   If you want them faster, up the prio and you will pay one extra credit per captcha
    const captchaId = await api.asyncSubmit(
      SITEKEY,
      SITEURL,
      OVERWRITE_PRIO_IF_YOU_WANT
    );
    console.log(`CAPTCHA ID: ${captchaId}`);

    // Get the solution of the captcha with a timeout of 40 seconds (optional)
    // this means that the callback will be called when the captcha is solved
    // For image Solving 9kw seems to store the solutions in their own DB
    //   and some are instantaneous others may take some more but usually under 30 sec
    // For CaptchaV2 (sitekey + siteUrl) will need to be solved by someone in real time
    //   so using the priority becomes important if you want faster captchas
    //   300 seconds (with 0 prio) is a reasonable number so you don't miss solved captchas
    //   If you want them faster, up the prio and you will pay one extra credit per captcha
    // usually is solved under 30s (default timeout is 30 seconds)
    const solution = await api.asyncGetSolutionLoop(captchaId, 300);
    console.log("SOLUTION: ", solution);
  } catch (err) {
    console.error(err); // Timeout or NO_USER
  }
})();
```

## 1.3. Callbacks

```js
const Api9kw = require("9kw");
const api = new Api9kw(/* You can pass parameters here or just use the ENV vars */);

// Get your account balance (credits)
api.getBalance((err, balance) => {
  console.log(balance);
});

// Submit a local image file with the captcha
// api.submitFile("./captcha.png", (err, newID) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Captcha uploaded!: " + captchaId);
//   // Next step is to get the solution of the uploaded captcha using the new captchaID
// });

// Submit using a Image Base 64 of the captha
// api.submitUrl(base64, (err, newID) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log("Captcha uploaded!: " + captchaId);
//   // Next step is to get the solution of the uploaded captcha using the new captchaID
// });

// Submit using a Image URL of the captha
api.submit(URL, (err, newID) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Captcha uploaded!: " + captchaId);
  // Next step is to get the solution of the uploaded captcha using the new captchaID
});

// Submit CaptchaV2 (using a siteKey + siteUrl)
// CaptchaV2 will need to be solved by someone in real time
//   so using the priority becomes important if you want faster captchas
//   300 seconds (with 0 prio) is a reasonable number so you don't miss solved captchas
//   If you want them faster, up the prio and you will pay one extra credit per captcha
api.submit(
  SITE_KEY,
  (err, newID) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Captcha uploaded!: " + captchaId);
    // Next step is to get the solution of the uploaded captcha using the new captchaID
  },
  SITE_URL,
  OVERWRITE_PRIO_IF_YOU_WANT
);

// Get the solution of the captcha with a timeout of 40 seconds (optional)
// this means that the callback will be called when the captcha is solved
// usually is solved under 30s (default timeout is 30 seconds)
api.getSolutionLoop(captchaId, 40, (err, solution) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("Solution: " + solution);
});

// Tell 9kw the solution was correct or not
api.isCorrect(captchaId, true);

// Get the 9kw server check info
api.serverCheck((err, serverInfo) => {
  console.log(serverInfo);
});
```

## 1.4. Development

### 1.4.1. Linting and Generating Docs

```sh
npm run flow
```

### 1.4.2. Tests

In order to run the tests, create a .env file as .env.default and put your account details in the correct ENV variables, then run:

```sh
npm run test
```

## 1.5. Credits

This project was initially a fork of [iamfreee/9kw_node](https://github.com/iamfreee/9kw_node.git)
