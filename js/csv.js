
/*
author : lifecodemohit
lang   : coffeescript
 */

(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['droplet-helper', 'droplet-model', 'droplet-parser', 'csvscript'], function(helper, model, parser, csvscript) {
    var csvParser;
    csvParser = (function(superClass) {
      extend(csvParser, superClass);

      function csvParser() {
        return csvParser.__super__.constructor.apply(this, arguments);
      }

      csvParser.prototype.markRoot = function() {
        var tree;
        tree = csvscript.parse(this.text);
        console.log(tree);
        return this.mark(0, tree, 0);
      };

      csvParser.prototype.getcolor = function(node) {
        switch (node.type) {
          case 'each_node':
            return 'violet';
          case 'comment':
            return 'white';
        }
      };

      csvParser.prototype.getSocketLevel = function(node) {
        return helper.ANY_DROP;
      };

      csvParser.prototype.getAcceptsRule = function(node) {
        return {
          "default": helper.VALUE_ONLY
        };
      };

      csvParser.prototype.getClasses = function(node) {
        switch (node.type) {
          case 'each_node':
            return [node.type, 'mostly-block'];
          case 'comment':
            return [node.type, 'no-drop'];
          case 'each_node_node':
            return [node.type, 'mostly-value'];
        }
      };

      csvParser.prototype.getBounds = function(node) {
        var bounds;
        bounds = {
          start: {
            line: node.loc.start.line,
            column: node.loc.start.column
          },
          end: {
            line: node.loc.end.line,
            column: node.loc.end.column
          }
        };
        return bounds;
      };

      csvParser.prototype.getSocketBounds = function(tree) {
        var bounds;
        bounds = {
          start: {
            line: tree.loc.start.line,
            column: tree.loc.start.column
          },
          end: {
            line: tree.loc.end.line,
            column: tree.loc.end.column
          }
        };
        return bounds;
      };

      csvParser.prototype.mark = function(indentDepth, node, depth) {
        var argument, i, j, len, len1, ref, ref1, results, results1, statement;
        switch (node.type) {
          case 'Program':
            ref = node.body;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              statement = ref[i];
              results.push(this.mark(indentDepth, statement, depth + 1));
            }
            return results;
            break;
          case 'each_node':
            this.csvBlock(node, depth);
            ref1 = node.node_list;
            results1 = [];
            for (j = 0, len1 = ref1.length; j < len1; j++) {
              argument = ref1[j];
              results1.push(this.csvSocketAndMark(indentDepth, argument, depth + 1));
            }
            return results1;
            break;
          case 'comment':
            return this.csvBlock(node, depth);
        }
      };

      csvParser.prototype.csvBlock = function(node, depth) {
        return this.addBlock({
          bounds: this.getBounds(node),
          depth: 0,
          precedence: 0,
          color: this.getcolor(node),
          classes: this.getClasses(node),
          socketLevel: this.getSocketLevel(node)
        });
      };

      csvParser.prototype.csvSocketAndMark = function(indentDepth, node, depth, precedence, bounds) {
        return this.addSocket({
          bounds: bounds != null ? bounds : this.getBounds(node),
          depth: depth,
          precedence: precedence,
          classes: this.getClasses(node),
          accepts: this.getAcceptsRule(node)
        });
      };

      csvParser.parens = function(leading, trailing, node, context) {
        return [leading, trailing];
      };

      csvParser.drop = function(block, context, pred) {
        if (context.type === 'socket') {
          return helper.FORBID;
        } else {
          return helper.ENCOURAGE;
        }
      };

      return csvParser;

    })(parser.Parser);
    return parser.wrapParser(csvParser);
  });

}).call(this);

//# sourceMappingURL=csv.js.map
