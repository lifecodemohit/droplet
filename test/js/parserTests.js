(function() {
  var assert, fs, requirejs;

  requirejs = require('requirejs');

  assert = require('assert');

  fs = require('fs');

  requirejs.config({
    nodeRequire: require,
    baseUrl: __dirname,
    paths: {
      'droplet-coffee': '../../dist/droplet',
      'coffee-script': '../../vendor/coffee-script.js'
    }
  });

  describe('Parser unity', function(done) {
    var coffee, testFile, testString;
    coffee = null;
    before(function(done) {
      return requirejs(['droplet-coffee'], function(module) {
        coffee = new module();
        return done();
      });
    });
    testString = function(str) {
      return it('should round-trip ' + str.split('\n')[0] + (str.split('\n').length > 1 ? '...' : ''), function() {
        return assert.equal(str, coffee.parse(str, {
          wrapAtRoot: true
        }).stringify());
      });
    };
    testString('/// #{x} ///');
    testString('fd 10');
    testString('fd 10 + 10');
    testString('console.log 10 + 10');
    testString('for i in [1..10]\n  console.log 10 + 10');
    testString('array = []\nif a is b\n  while p is q\n    make spaghetti\n    eat spaghetti\n    array.push spaghetti\n  for i in [1..10]\n    console.log 10 + 10\nelse\n  see \'hi\'\n  for key, value in window\n    see key + \' is \' + value\n    see key is value\n    see array[n]');
    testFile = function(name) {
      return it("should round-trip on " + name, function() {
        var file, filelines, i, j, len, line, ref, results, unparsed;
        file = fs.readFileSync(name).toString();
        unparsed = coffee.parse(file, {
          wrapAtRoot: true
        }).stringify();
        filelines = file.split('\n');
        ref = unparsed.split('\n');
        results = [];
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          line = ref[i];
          results.push(assert.equal(line, filelines[i], i + " failed"));
        }
        return results;
      });
    };
    testFile('test/data/nodes.coffee');
    return testFile('test/data/allTests.coffee');
  });

}).call(this);

//# sourceMappingURL=parserTests.js.map
