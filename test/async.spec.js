// @ts-nocheck
const assert = require('assert');
const api_9kw = require('../src/index');
const config = require('./config');

describe('Captcha', () => {
  let captcha = null;

  before(() => {
    captcha = api_9kw(config.apiKey);
    captcha.debug = 1;
  });

  describe('Submit API', () => {
    describe('#submit()', () => {
      it('with valid image provided', async (done) => {
        const { err, captchaID } = await captcha.asyncSubmit(
          './test/captcha.png',
        );
        assert(err === null, err);
        assert(typeof captchaID === 'number');
        done();
      });
    });

    describe('#submitBase64()', () => {
      it('with valid base64 provided', async (done) => {
        const { err, captchaID } = await captcha.asyncSubmitBase64(
          config.image_base64,
        );
        assert(err === null, err);
        assert(typeof captchaID === 'number');
        done();
      });
    });

    describe('#submitUrl()', () => {
      it('with valid image url provided', async (done) => {
        const { err, captchaID } = await captcha.asyncSubmitUrl(
          config.image_url,
        );
        assert(err === null, err);
        assert(typeof captchaID === 'number');
        done();
      });
    });

    describe('#getSolution()', () => {
      it('valid debug captcha id should run without problems', async (done) => {
        const { err, solution } = await captcha.asyncGetSolution('11111111');
        done(err);
      });
    });

    describe('#getSolutionLoop()', () => {
      it('should run without problems with a valid debug captcha id', async (done) => {
        const { err, solution } = await captcha.asyncGetSolutionLoop(
          '11111111',
          40,
        );
        done(err);
      });
    });

    describe('#isCorrect()', () => {
      it('should send the captcha feedback without problemas', async (done) => {
        const { err, res } = await captcha.asyncIsCorrect('11111111', true);
        assert(err === null, err);
        assert(res === 'OK', res);
        done();
      });
    });
  });

  describe('General API', () => {
    describe('#serverCheck()', () => {
      it('should get the server info without problems', async (done) => {
        const { err, res } = await captcha.asyncServerCheck();
        done(err);
      });
    });

    describe('#getBalance()', () => {
      it('should get the account balance', async (done) => {
        const { err, res } = await captcha.asyncGetBalance();
        done(err);
      });
    });
  });
});
