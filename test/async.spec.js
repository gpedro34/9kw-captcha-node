// @ts-nocheck
const assert = require("assert");
const Api9kw = require("../src/index");
const config = require("./config");

describe("Async/Await", () => {
  let api = null;

  before(() => {
    api = new Api9kw();
  });

  describe("Submit API", () => {
    describe("#asyncSubmit()", () => {
      it("with valid SiteKey + SiteURL", async (done) => {
        try {
          const captchaId = await api.asyncSubmit(
            config.siteKey,
            config.siteUrl
          );
          assert(typeof captchaId === "number");
        } catch (err) {
          assert(typeof err.message === "string");
          done(err);
        }
      });
      it("with valid image url provided", async (done) => {
        try {
          const captchaId = await api.asyncSubmit(config.image_url);
          assert(typeof captchaId === "number");
        } catch (err) {
          assert(typeof err.message === "string");
          done(err);
        }
      });
    });
    describe("#asyncSubmitFile()", () => {
      it("with valid path to file", async (done) => {
        try {
          const captchaId = await api.asyncSubmitFile(config.pathToFile);
          assert(typeof captchaId === "number");
        } catch (err) {
          assert(typeof err.message === "string");
          done(err);
        }
      });
    });

    describe("#asyncSubmitBase64()", () => {
      it("with valid base64 provided", async (done) => {
        try {
          const captchaId = await api.asyncSubmitBase64(config.image_base64);
          assert(typeof captchaId === "number");
        } catch (err) {
          assert(typeof err.message === "string");
          done(err);
        }
      });
    });

    describe("#asyncGetSolutionLoop()", () => {
      it("with a valid debug captcha id", async (done) => {
        try {
          const solution = await api.asyncGetSolutionLoop(111111, 400);
          assert(typeof solution === "string");
        } catch (err) {
          assert(typeof err.message === "string");
        }
        done();
      });
    });

    describe("#asyncIsCorrect()", () => {
      it("should mark the captcha as failed", async (done) => {
        try {
          const captchaId = await api.asyncSubmitFile(config.pathToFile);
          const resFailed = await api.asyncIsCorrect(captchaId);
          assert(resFailed.status.success === false, resFailed);
          done();
        } catch (err) {
          assert(err === null, err);
        }
      });
      it("should mark the captcha as successful", async (done) => {
        try {
          const captchaId = await api.asyncSubmitFile(config.pathToFile);
          const resSuccess = await api.asyncIsCorrect(captchaId, true);
          assert(resSuccess.status.success === true, resSuccess);
          done();
        } catch (err) {
          assert(err === null, err);
        }
      });
    });
  });

  describe("General API", () => {
    describe("#asyncServerCheck()", () => {
      it("should get the server info without problems", async (done) => {
        try {
          const serverCheck = await api.asyncServerCheck();
          done(assert(typeof serverCheck === "string"));
        } catch (err) {
          done(err);
        }
      });
    });

    describe("#asyncGetBalance()", () => {
      it("should get the account balance", async (done) => {
        try {
          const balance = await api.asyncGetBalance();
          assert(typeof balance === "number");
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
