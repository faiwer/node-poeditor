'use strict';

const assert = require('assertthat');
const path = require('path');
const processenv = require('processenv');

const workers = require(path.resolve('./lib'));

describe('languages.list...', () => {
  it('... is of type function', (done) => {
    assert.that(workers.languages.list).is.ofType('function');
    done();
  });

  it('... rejects an error when function is called without a access token', (done) => {
    (async () => {
      try {
        await workers.languages.list();
      } catch (err) {
        assert.that(err).is.equalTo('Error: You must define a valid API Token!');
        done();
      }
    })();
  });

  it('... rejects an error when function is called without a id for the project', (done) => {
    (async () => {
      try {
        await workers.languages.list('abcdef');
      } catch (err) {
        assert.that(err).is.equalTo('Error: You must define a valid project id!');
        done();
      }
    })();
  });

  it('... must fetch the api error messages', (done) => {
    (async () => {
      try {
        await workers.languages.list('notfamoustoken', '1234');
      } catch (err) {
        assert.that(err).is.ofType('object');
        done();
      }
    })();
  });

  it('... must resolve all languages from the project when process is done', (done) => {
    (async () => {
      try {
        const add = await workers.projects.add(processenv('API_TOKEN'), 'listLanguage');
        const res = await workers.languages.list(processenv('API_TOKEN'), add.project.id);

        assert.that(res.languages).is.not.undefined();
        await workers.projects.delete(processenv('API_TOKEN'), add.project.id);
        done();
      } catch (err) {
        throw err;
      }
    })();
  });
});
