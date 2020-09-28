/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable no-confusing-arrow */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable quotes */
// @ts-nocheck

const request = require("superagent");

/**
 * Call the user callback or the resolve/reject Promise functions with either
 * an error String (ex: timeout)
 * or a Number with the captcha id
 * Optional Async/Await supported
 * @param {Object|String|null} err
 * @param {Object|null} response
 * @param {Function|Object} callback Fn: Needs to handle err<String|null>, captchaId<Integer>; Obj: {resolve, reject}
 * @param {Boolean} [async=false] to allow async/await
 */
const callbackSuperAgent = (err, response, callback, async = false) => {
  const res = response.text.trim();
  const captchaId = res.substring(
    res.indexOf(`name="captchaid" value="`) + 24,
    res.indexOf(`"></body></html>`)
  );
  const resolve = async ? callback.resolve : null;
  const reject = async ? callback.reject : null;
  if (err) {
    async ? reject(err) : callback(err);
  } else {
    async
      ? resolve(parseInt(captchaId, 10))
      : callback(null, parseInt(captchaId, 10));
  }
};

module.exports = class Api9kw {
  /**
   * 9kw Captcha object constructor
   * Supports solving of Captcha Types:
   * - Image
   * - reCaptcha v2
   * - reCaptcha v3
   * - Captcha URL
   * - Base64 Captcha
   * @param {String} [apiKey=process.env.CAPTCHA_API_KEY_9KW] 9kw API Key
   * @param {String} [source=process.env.CAPTCHA_SOURCE_9KW || ""] 9kw configured Source Tag
   * @param {String} [oldSource=process.env.CAPTCHA_OLD_SOURCE_9KW || ""] 9kw configured Old Source Tag
   * @param {Number} [prio=process.env.CAPTCHA_PRIO_9KW || 0] Priority (higher costs more points)
   * @param {Number} [debug=process.env.CAPTCHA_DEBUG_9KW || 0] Debug flag included on 9kw API calls (not for code debug itself)
   * @constructs
   * @namespace
   */
  constructor(
    apiKey = process.env.CAPTCHA_API_KEY_9KW,
    source = process.env.CAPTCHA_SOURCE_9KW,
    oldSource = process.env.CAPTCHA_OLD_SOURCE_9KW,
    prio = Number(process.env.CAPTCHA_PRIO_9KW),
    debug = Number(process.env.CAPTCHA_DEBUG_9KW)
  ) {
    this.source = source || "";
    this.oldSource = oldSource || "";
    this.prio = prio || 0;
    this.API_KEY = apiKey;
    this.debug = debug || 0;
    this.URL = "https://www.9kw.eu/";
    this.generalGetRequest = () =>
      request
        .get(`${this.URL}index.cgi`)
        .query(`apikey=${this.API_KEY}`)
        .query(`debug=${this.debug}`);
    this.constructUploadRequest = () =>
      request
        .post(`${this.URL}index.cgi`)
        .field("apikey", this.API_KEY)
        .field("action", "usercaptchaupload")
        .field("source", this.source)
        .field("oldsource", this.oldSource)
        .field("debug", this.debug);
    return this;
  }

  /**
   * Submit the captcha (Image/Audio URL or Site Key)
   * Callback will receive err, captchaID where the captchaID is an integer
   * @param {String} imageUrlOrSiteKey Path to the image or siteKey
   * @param {Function} callback Needs to handle err<Object|String|null>, response<Object|String>
   * @param {String} [siteUrl=undefined] URL of the site containing recaptcha
   * @param {Number} [priority=process.env.CAPTCHA_PRIO_9KW] Optional overwrite the priority from API. Usefull to have different priorities for different captchas in the same environment.
   * @method
   */
  submit(
    imageUrlOrSiteKey,
    callback,
    siteUrl = undefined,
    priority = this.prio
  ) {
    if (siteUrl) {
      this.constructUploadRequest()
        .field("file-upload-01", imageUrlOrSiteKey)
        .field("pageurl", siteUrl)
        .field("interactive", 1)
        .field("prio", priority)
        .end((err, response) => callbackSuperAgent(err, response, callback));
    } else {
      this.constructUploadRequest()
        .field("file-upload-01", imageUrlOrSiteKey)
        .field("prio", priority)
        .end((err, response) => callbackSuperAgent(err, response, callback));
    }
  }

  /**
   * Submit the captcha (Image, Audio or Site Key) - Async
   * Promise will resolve with err or captchaID where the captchaID is an integer
   * @method
   * @async
   * @param {String} imageUrlOrSiteKey Path to the image or siteKey (for siteKey solve the siteUrl must be set)
   * @param {String} [siteUrl=undefined] URL of the site containing recaptcha (required for siteKey solve)
   */
  asyncSubmit(imageUrlOrSiteKey, siteUrl = undefined, priority = this.prio) {
    if (priority)
      console.log(`OVERWRITING PRIO FROM ${this.prio} TO ${priority}`);

    return new Promise((resolve, reject) => {
      if (siteUrl) {
        this.constructUploadRequest()
          .field("file-upload-01", imageUrlOrSiteKey)
          .field("pageurl", siteUrl)
          .field("interactive", 1)
          .field("prio", priority)
          .end((err, response) => {
            if (response.text && response.text.indexOf("&id=")) {
              const captchaId = response.text.substring(
                response.text.indexOf("&id=") + 4,
                response.text.indexOf("&refresh=")
              );
              return resolve(parseInt(captchaId, 10));
            }
            return callbackSuperAgent(err, response, { resolve, reject }, true);
          });
      } else {
        this.constructUploadRequest()
          .field("file-upload-01", imageUrlOrSiteKey)
          .field("prio", priority)
          .end((err, response) =>
            callbackSuperAgent(err, response, { resolve, reject }, true)
          );
      }
    });
  }

  /**
   * Submit the captcha File (Image or Audio)
   * Callback will receive err, captchaID where the captchaID is an integer
   * @method
   * @param {String} pathToFile Path to the image or siteKey
   * @param {Function} callback Needs to handle err<Object|String|null>, response<Object|String>
   * @param {String} [siteUrl=undefined] URL of the site containing recaptcha
   * @param {Number} [priority=process.env.CAPTCHA_PRIO_9KW] Overwrite the priority from API. Usefull to have different priorities for different captchas in the same environment.
   */
  submitFile(pathToFile, callback, priority = this.prio) {
    return this.constructUploadRequest()
      .attach("file-upload-01", pathToFile)
      .field("prio", priority)
      .end((err, response) => callbackSuperAgent(err, response, callback));
  }

  /**
   * Submit the captcha File (Image or Audio) - Async
   * Promise will resolve with err or captchaID where the captchaID is an integer
   * @method
   * @async
   * @param {String} pathToFile Path to the image or siteKey (for siteKey solve the siteUrl must be set)
   * @param {String} [siteUrl=undefined] URL of the site containing recaptcha (required for siteKey solve)
   * @param {Number} [priority=process.env.CAPTCHA_PRIO_9KW] Overwrite the priority from API. Usefull to have different priorities for different captchas in the same environment.
   */
  asyncSubmitFile(pathToFile, priority = this.prio) {
    return new Promise((resolve, reject) => {
      this.constructUploadRequest()
        .attach("file-upload-01", pathToFile)
        .field("prio", priority)
        .end((err, response) =>
          callbackSuperAgent(err, response, { resolve, reject }, true)
        );
    });
  }

  /**
   * Submit the captcha (Base64)
   * Callback will receive err, captchaID where the captchaID is an integer
   * @method
   * @param {String} data Base64 string
   * @param {Function} callback Needs to handle err<Object|String|null>, response<Object|String>
   */
  submitBase64(data, callback) {
    const split = data.split(",");
    if (split.length > 1) data = split[1]; // remove data:image/png;base64, if exists

    this.constructUploadRequest()
      .field("file-upload-01", data)
      .field("base64", 1)
      .end((err, response) => callbackSuperAgent(err, response, callback));
  }

  /**
   * Submit the captcha (Base64)
   * Promise will resolve with err, captchaID where the captchaID is an integer
   * @method
   * @async
   * @param {String} data Base64 string
   */
  asyncSubmitBase64(data) {
    return new Promise((resolve, reject) => {
      const split = data.split(",");
      if (split.length > 1) data = split[1]; // remove data:image/png;base64, if exists

      this.constructUploadRequest()
        .field("file-upload-01", data)
        .field("base64", 1)
        .end((err, response) =>
          callbackSuperAgent(err, response, { resolve, reject }, true)
        );
    });
  }

  /**
   * Get the solution of that captcha id
   * The callback is called with err, solution
   * where solution can be a string or empty string if no solution yet
   * this method should be called until there is a solution
   * ex: every 3 seconds
   * @method
   * @param {String} captchaID
   * @param {Function} callback Needs to handle err<Object|String|null>, solution<Object|String>
   */
  getSolution(captchaID, callback) {
    this.generalGetRequest()
      .query("action=usercaptchacorrectdata")
      .query(`id=${captchaID}`)
      .end((err, res) => {
        if (err) {
          callback(err);
          return;
        }

        callback(null, res.text);
      });
  }

  /**
   * Get the solution of that captcha id
   * The callback is called with err, solution
   * where solution can be a string or empty string if no solution yet
   * this method should be called until there is a solution
   * ex: every 3 seconds
   * @method
   * @async
   * @param {String} captchaID
   */
  asyncGetSolution(captchaID) {
    return new Promise((resolve, reject) => {
      this.generalGetRequest()
        .query("action=usercaptchacorrectdata")
        .query(`id=${captchaID}`)
        .end((err, res) => {
          if (err) {
            reject(err);
            return;
          }

          // @ts-ignore
          resolve(null, res.text);
        });
    });
  }

  /**
   * Get the captcha solution
   * Tries to get the solution before the timeout every 3 seconds
   * If timeout, callback is called with error
   * If solution, callback is called with null, solution
   * @method
   * @param {String} captchaID
   * @param {Function} callback Needs to handle err<Object|String|null>, solution<Object|String>
   * @param {Number} [timeout=30] seconds to giveup (30 is a good number)
   */
  getSolutionLoop(captchaID, callback, timeout = 30) {
    const endTime = Date.now() + timeout * 1000;
    const self = this;

    /**
     * Function to get the solution
     * @param {String} id
     * @param {String|Object} end
     * @param {Function} cb Needs to handle err<Object|String|null>, solution<Object|String>
     */
    const func = (id, end, cb) => {
      /**
       * Callback Function to figure out if we already have a solution
       * @param {any} err
       * @param {String|Object} solution
       */
      self.getSolution(id, (err, solution) => {
        if (err || solution.length === 0) {
          // no solution yet

          if (end - Date.now() <= 0) {
            // time is out!
            cb("captcha timeout");
            return;
          }

          // no solution yet? lets try again in 3 seconds
          setTimeout(func, 3000, id, end, cb);
          return;
        }

        // WOW we got a solution!
        cb(null, solution);
      });
    };

    // call first time
    func(captchaID, endTime, callback);
  }

  /**
   * Get the captcha solution
   * Tries to get the solution before the timeout every 3 seconds
   * If timeout, Promise will reject with error
   * If solution, Promise will resolve with with solution
   * @method
   * @async
   * @param {String} captchaID
   * @param {Number} [timeout=30] seconds to giveup (30 is a good number)
   */
  asyncGetSolutionLoop(captchaID, timeout = 30) {
    return new Promise((resolve, reject) => {
      const endTime = Date.now() + timeout * 1000;
      const self = this;
      /**
       * Function to get the solution
       * @param {String} captchaID
       * @param {String|Object} endTime
       */
      const func = (id, end) => {
        /**
         * Callback Function to figure out if we already have a solution
         * @param {any} err
         * @param {String|Object} solution
         */
        // get solution
        self.getSolution(id, (err, solution) => {
          if (err || solution.length === 0) {
            // no solution yet
            if (end - Date.now() <= 0) {
              // time is out!
              reject(new Error("Captcha Timeout"));
              return;
            }
            // no solution yet? lets try again in 3 seconds
            setTimeout(func, 3000, id, end, resolve);
            return;
          }
          // WOW we got a solution!
          resolve(solution);
        });
      };
      // call first time
      func(captchaID, endTime);
    });
  }

  /**
   * Say to 9kw if the captcha solution you got from the getSolution method
   * is correct or incorrect
   * @method
   * @param {String} captchaID
   * @param {Boolean} [isCorrect=false]
   * @param {Function} [optionalCallback] Needs to handle err<Object|String|null>, resText<String>
   */
  isCorrect(captchaID, isCorrect = false, optionalCallback) {
    this.generalGetRequest()
      .query("action=usercaptchacorrectback")
      .query(`id=${captchaID}`)
      .query(`correct=${isCorrect ? 1 : 0}`)
      .end((err, res) => {
        // if callback exists, call it
        if (typeof optionalCallback !== "undefined") {
          if (err) {
            optionalCallback(err);
          } else {
            optionalCallback(null, res.text);
          }
        }
      });
  }

  /**
   * Say to 9kw if the captcha solution you got from the getSolution method
   * is correct or incorrect
   * Promise can resolve with response.text
   * Promise can reject with error
   * @method
   * @async
   * @param {String} captchaID
   * @param {Boolean} [isCorrect=false]
   */
  asyncIsCorrect(captchaID, isCorrect = false) {
    return new Promise((resolve, reject) => {
      this.generalGetRequest()
        .query("action=usercaptchacorrectback")
        .query(`id=${captchaID}`)
        .query(`correct=${isCorrect ? 1 : 0}`)
        .query(`json=1`)
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.text);
          }
        });
    });
  }

  /**
   * Get the server info
   * @method
   * @param {Function} callback Needs to handle err<Object|String|null>, serverinfoString<String>
   */
  serverCheck(callback) {
    request.get(`${this.URL}grafik/servercheck.txt`).end((err, res) => {
      if (err) {
        callback(err);
      } else {
        callback(null, res.text);
      }
    });
  }

  /**
   * Get the server info
   * If there is an error Promise will reject with error
   * If successful Promise will resolve with res.text
   * @method
   * @async
   */
  asyncServerCheck() {
    return new Promise((resolve, reject) => {
      request.get(`${this.URL}grafik/servercheck.txt`).end((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.text);
        }
      });
    });
  }

  /**
   * Get the user balance
   * @method
   * @param {Function} callback Needs to handle err<Object|String|null>, response<String>
   */
  getBalance(callback) {
    this.generalGetRequest()
      .query("action=usercaptchaguthaben")
      .end((err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, parseInt(res.text, 10));
        }
      });
  }

  /**
   * Get the user balance
   * @method
   * @async
   */
  asyncGetBalance() {
    return new Promise((resolve, reject) => {
      this.generalGetRequest()
        .query("action=usercaptchaguthaben")
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(parseInt(res.text, 10));
          }
        });
    });
  }
};
