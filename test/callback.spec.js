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
      it('with valid image provided', (done) => {
        captcha.submit('./test/captcha.png', (err, captchaID) => {
          assert(err === null, err);
          assert(typeof captchaID === 'number');
          done();
        });
      });
    });

    describe('#submitBase64()', () => {
      it('with valid base64 provided', (done) => {
        captcha.submitBase64(config.image_base64, (err, captchaID) => {
          assert(err === null, err);
          assert(typeof captchaID === 'number');
          done();
        });
      });
    });

    describe('#submitUrl()', () => {
      it('with valid image url provided', (done) => {
        captcha.submitUrl(config.image_url, (err, captchaID) => {
          assert(err === null, err);
          assert(typeof captchaID === 'number');
          done();
        });
      });
    });

    describe('#getSolution()', () => {
      it('valid debug captcha id should run without problems', (done) => {
        captcha.getSolution('11111111', (err, solution) => {
          done(err);
        });
      });
    });

    describe('#getSolutionLoop()', () => {
      it('should run without problems with a valid debug captcha id', (done) => {
        captcha.getSolutionLoop('11111111', 40, (err, solution) => {
          done(err);
        });
      });
    });

    describe('#isCorrect()', () => {
      it('should send the captcha feedback without problemas', (done) => {
        captcha.isCorrect('11111111', true, (err, res) => {
          assert(err === null, err);
          assert(res === 'OK', res);
          done();
        });
      });
    });
  });

  describe('General API', () => {
    describe('#serverCheck()', () => {
      it('should get the server info without problems', (done) => {
        captcha.serverCheck((err, res) => {
          done(err);
        });
      });
    });

    describe('#getBalance()', () => {
      it('should get the account balance', (done) => {
        captcha.getBalance((err, res) => {
          done(err);
        });
      });
    });
  });
});
