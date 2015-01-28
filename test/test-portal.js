'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('cmp:portal', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../portal'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompts({
        someOption: true
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.gitignore',
      '.editorconfig',
      '.jshintrc',
      'mklink.bat',
      'package.json',
      'cmp.json',
      'config.yml',
      'params.json',
      'Gruntfile.js'
    ]);
  });
});
