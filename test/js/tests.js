(function() {
  require(['droplet-helper', 'droplet-model', 'droplet-parser', 'droplet-coffee', 'droplet-javascript', 'droplet-view', 'droplet'], function(helper, model, parser, Coffee, JavaScript, view, droplet) {
    var coffee;
    coffee = new Coffee();
    test('Parser success', function() {
      var data, i, len, q, results, testCase;
      q = new XMLHttpRequest();
      q.open('GET', '/test/data/parserSuccess.json', false);
      q.send();
      data = JSON.parse(q.responseText);
      window.dumpObj = [];
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        testCase = data[i];
        strictEqual(helper.xmlPrettyPrint(coffee.parse(testCase.str, {
          wrapAtRoot: true
        }).serialize()), helper.xmlPrettyPrint(testCase.expected), testCase.message);
        results.push(window.dumpObj.push({
          message: testCase.message,
          str: testCase.str,
          expected: helper.xmlPrettyPrint(coffee.parse(testCase.str, {
            wrapAtRoot: true
          }).serialize())
        }));
      }
      return results;
    });
    test('Parser configurability', function() {
      var customCoffee, customSerialization, expectedSerialization;
      customCoffee = new Coffee({
        functions: {
          marius: {
            color: 'red'
          },
          valjean: {},
          eponine: {
            value: true,
            color: 'purplish'
          },
          fantine: {
            value: true
          },
          cosette: {
            command: true,
            value: true
          }
        }
      });
      window.customSerialization = customSerialization = customCoffee.parse('marius eponine 10\nalert random 100\ncosette 20').serialize();
      expectedSerialization = '<segment\n  isLassoSegment="false"\n><block\n  precedence="0"\n  color="red"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-block"\n>marius <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Call works-as-method-call"\n><block\n  precedence="0"\n  color="purplish"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-value"\n>eponine <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Value">10</socket></block></socket></block>\n<block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call any-drop"\n><socket\n  precedence="0"\n  handwritten="false"\n  classes="Value"\n>alert</socket> <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Call works-as-method-call"\n><block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call any-drop"\n><socket\n  precedence="0"\n  handwritten="false"\n  classes="Value"\n>random</socket> <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Value">100</socket></block></socket></block>\n<block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call any-drop">cosette <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Value">20</socket></block></segment>';
      return strictEqual(helper.xmlPrettyPrint(customSerialization), helper.xmlPrettyPrint(expectedSerialization), 'Custom known functions work');
    });
    test('Dotted methods', function() {
      var customCoffee, customSerialization, expectedSerialization;
      customCoffee = new Coffee({
        functions: {
          'console.log': {},
          speak: {},
          'Math.log': {
            value: true
          },
          log: {
            value: true
          },
          setTimeout: {
            command: true,
            value: true
          }
        }
      });
      customSerialization = customCoffee.parse('console.log Math.log log x.log log').serialize();
      expectedSerialization = '<segment\n  isLassoSegment="false"\n><block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-block"\n>console.log <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Call works-as-method-call"\n><block\n  precedence="0"\n  color="value"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-value"\n>Math.log <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Call works-as-method-call"\n><block\n  precedence="0"\n  color="value"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-value"\n>log <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Call works-as-method-call"\n><block\n  precedence="0"\n  color="value"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-value"\n><socket\n  precedence="0"\n  handwritten="false"\n  classes="Literal"\n>x</socket\n>.log <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Value"\n>log</socket\n></block></socket></block></socket></block></socket></block></segment>';
      return strictEqual(helper.xmlPrettyPrint(customSerialization), helper.xmlPrettyPrint(expectedSerialization), 'Dotted known functions work');
    });
    test('JS dotted methods', function() {
      var customJS, customSerialization, expectedSerialization;
      customJS = new JavaScript({
        functions: {
          'console.log': {},
          speak: {},
          'Math.log': {
            value: true
          },
          log: {
            value: true,
            color: 'red'
          },
          setTimeout: {
            command: true,
            value: true
          }
        }
      });
      customSerialization = customJS.parse('return console.log(Math.log(log(x.log(~log))));').serialize();
      expectedSerialization = '<segment\n  isLassoSegment="false"\n><block\n  precedence="0"\n  color="return"\n  socketLevel="0"\n  classes="ReturnStatement mostly-block"\n>return <socket\n  precedence="0"\n  handwritten="false"\n  classes=""\n><block\n  precedence="2"\n  color="command"\n  socketLevel="0"\n  classes="CallExpression mostly-block"\n>console.log(<socket\n  precedence="100"\n  handwritten="false"\n  classes=""\n><block\n  precedence="2"\n  color="value"\n  socketLevel="0"\n  classes="CallExpression mostly-value"\n>Math.log(<socket\n  precedence="100"\n  handwritten="false"\n  classes=""\n><block\n  precedence="2"\n  color="red"\n  socketLevel="0"\n  classes="CallExpression mostly-value"\n>log(<socket\n  precedence="100"\n  handwritten="false"\n  classes=""\n><block\n  precedence="2"\n  color="red"\n  socketLevel="0"\n  classes="CallExpression mostly-value"\n>x.log(<socket\n  precedence="100"\n  handwritten="false"\n  classes=""\n><block\n  precedence="4"\n  color="value"\n  socketLevel="0"\n  classes="UnaryExpression mostly-value"\n>~<socket\n  precedence="4"\n  handwritten="false"\n  classes=""\n>log</socket></block></socket\n>)</block></socket\n>)</block></socket\n>)</block></socket\n>)</block></socket\n>;</block></segment>';
      return strictEqual(helper.xmlPrettyPrint(customSerialization), helper.xmlPrettyPrint(expectedSerialization), 'Dotted known functions work');
    });
    test('Merged code blocks', function() {
      var customSerialization, expectedSerialization;
      coffee = new Coffee;
      customSerialization = coffee.parse('x = (y) -> y * y\nalert \'clickme\', ->\n  console.log \'ouch\'').serialize();
      expectedSerialization = '<segment\n  isLassoSegment="false"\n><block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Assign mostly-block"\n><socket\n  precedence="0"\n  handwritten="false"\n  classes="Value lvalue"\n>x</socket\n> = (<socket\n  precedence="0"\n  handwritten="false"\n  classes="Param forbid-all"\n>y</socket\n>) -&gt; <socket\n  precedence="0"\n  handwritten="false"\n  classes="Block"\n><block\n  precedence="5"\n  color="value"\n  socketLevel="0"\n  classes="Op value-only"\n><socket\n  precedence="5"\n  handwritten="false"\n  classes="Value"\n>y</socket\n> * <socket\n  precedence="5"\n  handwritten="false"\n  classes="Value"\n>y</socket></block></socket></block>\n<block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-block"\n>alert <socket\n  precedence="0"\n  handwritten="false"\n  classes="Value"\n>\'clickme\'</socket\n>, -&gt;<indent\n  prefix="  "\n  classes=""\n>\n<block\n  precedence="0"\n  color="command"\n  socketLevel="0"\n  classes="Call works-as-method-call mostly-block"\n>console.log <socket\n  precedence="-1"\n  handwritten="false"\n  classes="Value"\n>\'ouch\'</socket></block></indent></block></segment>';
      return strictEqual(helper.xmlPrettyPrint(customSerialization), helper.xmlPrettyPrint(expectedSerialization), 'Merged code blocks work');
    });
    test('XML parser unity', function() {
      var data, i, len, q, results, testCase, xml;
      q = new XMLHttpRequest();
      q.open('GET', '/test/data/parserSuccess.json', false);
      q.send();
      data = JSON.parse(q.responseText);
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        testCase = data[i];
        xml = coffee.parse(testCase.str, {
          wrapAtRoot: true
        }).serialize();
        results.push(strictEqual(helper.xmlPrettyPrint(parser.parseXML(xml).serialize()), helper.xmlPrettyPrint(xml), 'Parser unity for: ' + testCase.message));
      }
      return results;
    });
    test('Basic token operations', function() {
      var a, b, c, d;
      a = new model.Token();
      b = new model.Token();
      c = new model.Token();
      d = new model.Token();
      strictEqual(a.append(b), b, 'append() return argument');
      strictEqual(a.prev, null, 'append assembles correct linked list');
      strictEqual(a.next, b, 'append assembles correct linked list');
      strictEqual(b.prev, a, 'append assembles correct linked list');
      strictEqual(b.next, null, 'append assembles correct linked list');
      b.append(c);
      b.remove();
      strictEqual(a.next, c, 'remove removes token');
      return strictEqual(c.prev, a, 'remove removes token');
    });
    test('Containers and parents', function() {
      var a, b, c, cont1, cont2, cont3, d, e, f, g, h;
      cont1 = new model.Container();
      cont2 = new model.Container();
      a = cont1.start;
      b = new model.Token();
      c = cont2.start;
      d = new model.Token();
      e = cont2.end;
      f = cont1.end;
      a.append(b).append(c).append(d).append(e).append(f);
      cont1.correctParentTree();
      strictEqual(a.parent, null, 'correctParentTree() output is correct (a)');
      strictEqual(b.parent, cont1, 'correctParentTree() output is correct (b)');
      strictEqual(c.parent, cont1, 'correctParentTree() output is correct (c)');
      strictEqual(d.parent, cont2, 'correctParentTree() output is correct (d)');
      strictEqual(e.parent, cont1, 'correctParentTree() output is correct (e)');
      strictEqual(f.parent, null, 'correctParentTree() output is correct (f)');
      g = new model.Token();
      h = new model.Token;
      g.append(h);
      d.append(g);
      h.append(e);
      strictEqual(a.parent, null, 'splice in parents still work');
      strictEqual(b.parent, cont1, 'splice in parents still work');
      strictEqual(c.parent, cont1, 'splice in parents still work');
      strictEqual(d.parent, cont2, 'splice in parents still work');
      strictEqual(g.parent, cont2, 'splice in parents still work');
      strictEqual(h.parent, cont2, 'splice in parents still work');
      strictEqual(e.parent, cont1, 'splice in parents still work');
      strictEqual(f.parent, null, 'splice in parents still work');
      cont3 = new model.Container();
      cont3.spliceIn(g);
      return strictEqual(h.parent, cont2, 'splice in parents still work');
    });
    test('Get block on line', function() {
      var document;
      document = coffee.parse('for i in [1..10]\n  console.log i\nif a is b\n  console.log k\n  if b is c\n    console.log q\nelse\n  console.log j');
      strictEqual(document.getBlockOnLine(1).stringify(coffee.empty), 'console.log i', 'line 1');
      strictEqual(document.getBlockOnLine(3).stringify(coffee.empty), 'console.log k', 'line 3');
      strictEqual(document.getBlockOnLine(5).stringify(coffee.empty), 'console.log q', 'line 5');
      return strictEqual(document.getBlockOnLine(7).stringify(coffee.empty), 'console.log j', 'line 7');
    });
    test('Location serialization unity', function() {
      var document, head, results;
      document = coffee.parse('for i in [1..10]\n  console.log hello\n  if a is b\n    console.log world');
      head = document.start.next;
      results = [];
      while (head !== document.end) {
        strictEqual(document.getTokenAtLocation(head.getSerializedLocation()), head, 'Equality for ' + head.type);
        results.push(head = head.next);
      }
      return results;
    });
    test('Block move', function() {
      var document;
      document = coffee.parse('for i in [1..10]\n  console.log hello\n  console.log world');
      document.getBlockOnLine(2).moveTo(document.start, coffee);
      strictEqual(document.stringify(coffee.empty), 'console.log world\nfor i in [1..10]\n  console.log hello', 'Move console.log world out');
      document.getBlockOnLine(2).moveTo(document.start, coffee);
      strictEqual(document.stringify(coffee.empty), 'console.log hello\nconsole.log world\nfor i in [1..10]\n  ``', 'Move both out');
      document.getBlockOnLine(0).moveTo(document.getBlockOnLine(2).end.prev.container.start, coffee);
      strictEqual(document.stringify(coffee.empty), 'console.log world\nfor i in [1..10]\n  console.log hello', 'Move hello back in');
      document.getBlockOnLine(1).moveTo(document.getBlockOnLine(0).end.prev.container.start, coffee);
      return strictEqual(document.stringify(coffee.empty), 'console.log (for i in [1..10]\n  console.log hello)', 'Move for into socket (req. paren wrap)');
    });
    test('specialIndent bug', function() {
      var document;
      document = coffee.parse('for i in [1..10]\n  ``\nfor i in [1..10]\n  alert 10');
      document.getBlockOnLine(2).moveTo(document.getBlockOnLine(1).end.prev.container.start, coffee);
      return strictEqual(document.stringify(coffee.empty), 'for i in [1..10]\n  for i in [1..10]\n    alert 10');
    });
    test('Paren wrap', function() {
      var block, document;
      document = coffee.parse('Math.sqrt 2\nconsole.log 1 + 1');
      (block = document.getBlockOnLine(0)).moveTo(document.getBlockOnLine(1).end.prev.prev.prev.container.start, coffee);
      strictEqual(document.stringify(coffee.empty), 'console.log 1 + (Math.sqrt 2)', 'Wrap');
      block.moveTo(document.start, coffee);
      return strictEqual(document.stringify(coffee.empty), 'Math.sqrt 2\nconsole.log 1 + ``', 'Unwrap');
    });
    test('View: compute children', function() {
      var blockView, document, documentView, indentView, view_;
      view_ = new view.View();
      document = coffee.parse('alert 10');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      strictEqual(documentView.lineChildren[0].length, 1, 'Children length 1 in `alert 10`');
      strictEqual(documentView.lineChildren[0][0].child, document.getBlockOnLine(0), 'Child matches');
      strictEqual(documentView.lineChildren[0][0].startLine, 0, 'Child starts on correct line');
      blockView = view_.getViewNodeFor(document.getBlockOnLine(0));
      strictEqual(blockView.lineChildren[0].length, 2, 'Children length 2 in `alert 10` block');
      strictEqual(blockView.lineChildren[0][0].child.type, 'text', 'First child is text');
      strictEqual(blockView.lineChildren[0][1].child.type, 'socket', 'Second child is socket');
      document = coffee.parse('for [1..10]\n  alert 10\n  prompt 10\n  alert 20');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      blockView = view_.getViewNodeFor(document.getBlockOnLine(0));
      strictEqual(blockView.lineChildren[1].length, 1, 'One child in indent');
      strictEqual(blockView.lineChildren[2][0].startLine, 0, 'Indent start line');
      strictEqual(blockView.multilineChildrenData[0], 1, 'Indent start data');
      strictEqual(blockView.multilineChildrenData[1], 2, 'Indent middle data');
      strictEqual(blockView.multilineChildrenData[2], 2, 'Indent middle data');
      strictEqual(blockView.multilineChildrenData[3], 3, 'Indent end data');
      document = coffee.parse('for [1..10]\n  for [1..10]\n    alert 10\n    alert 20');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      indentView = view_.getViewNodeFor(document.getBlockOnLine(1).end.prev.container);
      strictEqual(indentView.lineChildren[1][0].child.stringify(coffee.empty), 'alert 10', 'Relative line numbers');
      document = coffee.parse('console.log (for [1..10]\n  alert 10)');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      blockView = view_.getViewNodeFor(document.getBlockOnLine(0).start.next.next.container);
      strictEqual(blockView.lineChildren[1].length, 1, 'One child in indent in socket');
      return strictEqual(blockView.multilineChildrenData[1], 3, 'Indent end data');
    });
    test('View: compute dimensions', function() {
      var document, documentView, view_;
      view_ = new view.View();
      document = coffee.parse('for [1..10]\n  alert 10\n  alert 20');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      strictEqual(documentView.dimensions[0].height, view_.opts.textHeight + 4 * view_.opts.padding + 2 * view_.opts.textPadding, 'First line height (block, 2 padding)');
      strictEqual(documentView.dimensions[1].height, view_.opts.textHeight + 2 * view_.opts.padding + 2 * view_.opts.textPadding, 'Second line height (single block in indent)');
      strictEqual(documentView.dimensions[2].height, view_.opts.textHeight + 2 * view_.opts.padding + 2 * view_.opts.textPadding + view_.opts.indentTongueHeight, 'Third line height (indentEnd at root)');
      document = coffee.parse('alert (for [1..10]\n  alert 10\n  alert 20)');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      strictEqual(documentView.dimensions[0].height, view_.opts.textHeight + 5 * view_.opts.padding + 2 * view_.opts.textPadding, 'First line height (block, 3.5 padding)');
      strictEqual(documentView.dimensions[1].height, view_.opts.textHeight + 2 * view_.opts.padding + 2 * view_.opts.textPadding, 'Second line height (single block in nested indent)');
      strictEqual(documentView.dimensions[2].height, view_.opts.textHeight + 3 * view_.opts.padding + view_.opts.indentTongueHeight + 2 * view_.opts.textPadding, 'Third line height (indentEnd with padding)');
      document = coffee.parse('alert 10\n\nalert 20');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      return strictEqual(documentView.dimensions[1].height, view_.opts.textHeight + 2 * view_.opts.padding, 'Renders empty lines');
    });
    test('View: bounding box flag stuff', function() {
      var blockView, document, documentView, view_;
      view_ = new view.View();
      document = coffee.parse('alert 10\nalert 20\nalert 30\nalert 40');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      blockView = view_.getViewNodeFor(document.getBlockOnLine(3));
      strictEqual(blockView.path._points[0].y, view_.opts.textHeight * 4 + view_.opts.padding * 8 + view_.opts.textPadding * 8, 'Original path points are O.K.');
      document.getBlockOnLine(2).spliceOut();
      documentView.layout();
      return strictEqual(blockView.path._points[0].y, view_.opts.textHeight * 3 + view_.opts.padding * 6 + view_.opts.textPadding * 6, 'Final path points are O.K.');
    });
    test('View: sockets caching', function() {
      var block, document, documentView, socketView, view_;
      view_ = new view.View();
      document = coffee.parse('for i in [[[]]]\n  alert 10');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      socketView = view_.getViewNodeFor(document.getTokenAtLocation(8).container);
      strictEqual(socketView.model.stringify(coffee.empty), '[[[]]]', 'Correct block selected');
      strictEqual(socketView.dimensions[0].height, view_.opts.textHeight + 6 * view_.opts.padding, 'Original height is O.K.');
      (block = document.getTokenAtLocation(9).container).spliceOut();
      block.spliceIn(document.getBlockOnLine(1).start.prev.prev);
      documentView.layout();
      return strictEqual(socketView.dimensions[0].height, view_.opts.textHeight + 2 * view_.opts.textPadding, 'Final height is O.K.');
    });
    test('View: bottomLineSticksToTop bug', function() {
      var block, dest, document, documentView, testedBlock, testedBlockView, view_;
      view_ = new view.View();
      document = coffee.parse('setTimeout (->\n  alert 20\n  alert 10), 1 + 2 + 3 + 4 + 5');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      testedBlock = document.getBlockOnLine(2);
      testedBlockView = view_.getViewNodeFor(testedBlock);
      strictEqual(testedBlockView.dimensions[0].height, 2 * view_.opts.textPadding + 1 * view_.opts.textHeight + 8 * view_.opts.padding - 1 * view_.opts.indentTongueHeight, 'Original height O.K.');
      block = document.getBlockOnLine(1);
      dest = document.getBlockOnLine(2).end;
      block.moveTo(dest, coffee);
      documentView.layout();
      strictEqual(testedBlockView.dimensions[0].height, 2 * view_.opts.textPadding + 1 * view_.opts.textHeight + 2 * view_.opts.padding, 'Final height O.K.');
      block.moveTo(testedBlock.start.prev.prev, coffee);
      documentView.layout();
      return strictEqual(testedBlockView.dimensions[0].height, 2 * view_.opts.textPadding + 1 * view_.opts.textHeight + 8 * view_.opts.padding - 1 * view_.opts.indentTongueHeight, 'Dragging other block in works');
    });
    test('View: triple-quote sockets caching issue', function() {
      var document, documentView, socketView, view_;
      view_ = new view.View();
      document = coffee.parse('console.log \'hi\'');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      socketView = view_.getViewNodeFor(document.getTokenAtLocation(4).container);
      strictEqual(socketView.model.stringify(coffee.empty), '\'hi\'', 'Correct block selected');
      strictEqual(socketView.dimensions[0].height, view_.opts.textHeight + 2 * view_.opts.textPadding, 'Original height O.K.');
      strictEqual(socketView.topLineSticksToBottom, false, 'Original topstick O.K.');
      socketView.model.start.append(socketView.model.end);
      socketView.model.start.append(new model.TextToken('"""')).append(new model.NewlineToken()).append(new model.TextToken('hello')).append(new model.NewlineToken()).append(new model.TextToken('world"""')).append(socketView.model.end);
      socketView.model.notifyChange();
      documentView.layout();
      strictEqual(socketView.topLineSticksToBottom, true, 'Intermediate topstick O.K.');
      socketView.model.start.append(new model.TextToken('\'hi\'')).append(socketView.model.end);
      socketView.model.notifyChange();
      documentView.layout();
      socketView = view_.getViewNodeFor(document.getTokenAtLocation(4).container);
      strictEqual(socketView.dimensions[0].height, view_.opts.textHeight + 2 * view_.opts.textPadding, 'Final height O.K.');
      return strictEqual(socketView.topLineSticksToBottom, false, 'Final topstick O.K.');
    });
    test('View: empty socket heights', function() {
      var document, documentView, emptySocketView, fullSocketView, view_;
      view_ = new view.View();
      document = coffee.parse('if `` is a\n  ``');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      emptySocketView = view_.getViewNodeFor(document.getTokenAtLocation(6).container);
      fullSocketView = view_.getViewNodeFor(document.getTokenAtLocation(9).container);
      return strictEqual(emptySocketView.dimensions[0].height, fullSocketView.dimensions[0].height, 'Full and empty sockets same height');
    });
    test('View: indent carriage arrow', function() {
      var block, blockView, document, documentView, indent, indentView, view_;
      view_ = new view.View();
      document = parser.parseXML('<block>hello <indent><block>my <socket>name</socket></block>\n<block>is elder <socket>price</socket></block></indent></block>');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      block = document.getBlockOnLine(1).start.prev.prev.container;
      blockView = view_.getViewNodeFor(block);
      strictEqual(blockView.carriageArrow, 1, 'Carriage arrow flag is set');
      strictEqual(blockView.dropPoint.x, view_.opts.indentWidth, 'Drop point is on the left');
      strictEqual(blockView.dropPoint.y, 1 * view_.opts.textHeight + 4 * view_.opts.padding + 2 * view_.opts.textPadding, 'Drop point is further down');
      indent = block.start.prev.container;
      indentView = view_.getViewNodeFor(indent);
      return strictEqual(indentView.glue[0].height, view_.opts.padding, 'Carriage arrow causes glue');
    });
    test('View: sidealong carriage arrow', function() {
      var block, blockView, document, documentView, indent, indentView, view_;
      view_ = new view.View();
      document = parser.parseXML('<block>hello <indent>\n<block>my <socket>name</socket></block><block>is elder <socket>price</socket></block></indent></block>');
      documentView = view_.getViewNodeFor(document);
      documentView.layout();
      block = document.getBlockOnLine(1).end.next.container;
      blockView = view_.getViewNodeFor(block);
      strictEqual(blockView.carriageArrow, 0, 'Carriage arrow flag is set');
      strictEqual(blockView.dropPoint.x, view_.opts.indentWidth, 'Drop point is on the left');
      indent = block.end.next.container;
      indentView = view_.getViewNodeFor(indent);
      return strictEqual(indentView.dimensions[1].height, view_.opts.textHeight + 2 * view_.opts.textPadding + 3 * view_.opts.padding, 'Carriage arrow causes expand');
    });
    asyncTest('Controller: ace editor mode', function() {
      var done, editor, resolve, resolved;
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      done = false;
      resolved = false;
      resolve = function() {
        if (resolved) {
          return;
        }
        resolved = true;
        ok(done);
        return start();
      };
      editor.aceEditor.session.on('changeMode', function() {
        strictEqual(editor.aceEditor.session.getMode().$id, 'ace/mode/coffee');
        done = true;
        return resolve();
      });
      return setTimeout(resolve, 1000);
    });
    asyncTest('Controller: melt/freeze events', function() {
      var editor, states;
      expect(3);
      states = [];
      document.getElementById('test-main').innerHTML = '';
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      editor.on('statechange', function(usingBlocks) {
        return states.push(usingBlocks);
      });
      return editor.performMeltAnimation(10, 10, function() {
        return editor.performFreezeAnimation(10, 10, function() {
          strictEqual(states.length, 2);
          strictEqual(states[0], false);
          strictEqual(states[1], true);
          return start();
        });
      });
    });
    asyncTest('Controller: palette events', function() {
      var dispatchMouse, editor, headers, i, j, ref, states;
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: [
          {
            name: 'Draw',
            color: 'blue',
            blocks: [
              {
                block: 'pen purple',
                title: 'Set the pen color',
                id: 'pen'
              }
            ]
          }, {
            name: 'Move',
            color: 'red',
            blocks: [
              {
                block: 'moveto 100, 100',
                title: 'Move to a coordinate',
                id: 'moveto'
              }
            ]
          }
        ]
      });
      dispatchMouse = function(name, e) {
        var cr, ev, mx, my;
        cr = e.getBoundingClientRect();
        mx = Math.floor((cr.left + cr.right) / 2);
        my = Math.floor((cr.top + cr.bottom) / 2);
        ev = document.createEvent('MouseEvents');
        ev.initMouseEvent(name, true, true, window, 0, mx, my, mx, my, false, false, false, false, 0, null);
        return e.dispatchEvent(ev);
      };
      states = [];
      editor.on('selectpalette', function(name) {
        return states.push('s:' + name);
      });
      headers = document.getElementsByClassName('droplet-palette-group-header');
      for (j = i = ref = headers.length - 1; ref <= 0 ? i <= 0 : i >= 0; j = ref <= 0 ? ++i : --i) {
        dispatchMouse('click', headers[j]);
      }
      deepEqual(states, ['s:Move', 's:Draw']);
      return start();
    });
    test('Controller: cursor motion and rendering', function() {
      var editor, states;
      states = [];
      document.getElementById('test-main').innerHTML = '';
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      editor.setValue('alert 10\nif a is b\n  alert 20\n  alert 30\nelse\n  alert 40');
      strictEqual(editor.determineCursorPosition().x, 0, 'Cursor position correct (x - down)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight, 'Cursor position correct (y - down)');
      editor.moveCursorTo(editor.cursor.next.next);
      strictEqual(editor.determineCursorPosition().x, 0, 'Cursor position correct after \'alert 10\' (x - down)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 1 * editor.view.opts.textHeight + 2 * editor.view.opts.padding + 2 * editor.view.opts.textPadding, 'Cursor position correct after \'alert 10\' (y - down)');
      editor.moveCursorTo(editor.cursor.next.next);
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct after \'if a is b\' (x - down)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 2 * editor.view.opts.textHeight + 6 * editor.view.opts.padding + 4 * editor.view.opts.textPadding, 'Cursor position correct after \'if a is b\' (y - down)');
      editor.moveCursorTo(editor.cursor.next.next);
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct after \'alert 20\' (x - down)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 3 * editor.view.opts.textHeight + 8 * editor.view.opts.padding + 6 * editor.view.opts.textPadding, 'Cursor position correct after \'alert 20\' (y - down)');
      editor.moveCursorTo(editor.cursor.next.next);
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct at end of indent (x - down)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 4 * editor.view.opts.textHeight + 10 * editor.view.opts.padding + 8 * editor.view.opts.textPadding, 'Cursor position at end of indent (y - down)');
      editor.moveCursorTo(editor.cursor.next.next);
      strictEqual(editor.cursor.parent.type, 'indent', 'Cursor skipped middle of block');
      editor.moveCursorUp();
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct at end of indent (x - up)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 4 * editor.view.opts.textHeight + 10 * editor.view.opts.padding + 8 * editor.view.opts.textPadding, 'Cursor position at end of indent (y - up)');
      editor.moveCursorUp();
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct after \'alert 20\' (x - up)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 3 * editor.view.opts.textHeight + 8 * editor.view.opts.padding + 6 * editor.view.opts.textPadding, 'Cursor position correct after \'alert 20\' (y - up)');
      editor.moveCursorUp();
      strictEqual(editor.determineCursorPosition().x, editor.view.opts.indentWidth, 'Cursor position correct after \'if a is b\' (y - up)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 2 * editor.view.opts.textHeight + 6 * editor.view.opts.padding + 4 * editor.view.opts.textPadding, 'Cursor position correct after \'if a is b\' (y - up)');
      editor.moveCursorUp();
      strictEqual(editor.determineCursorPosition().x, 0, 'Cursor position correct after \'alert 10\' (x - up)');
      strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight + 1 * editor.view.opts.textHeight + 2 * editor.view.opts.padding + 2 * editor.view.opts.textPadding, 'Cursor position correct after \'alert 10\' (y - up)');
      editor.moveCursorUp();
      strictEqual(editor.determineCursorPosition().x, 0, 'Cursor position correct at origin (x - up)');
      return strictEqual(editor.determineCursorPosition().y, editor.nubbyHeight, 'Cursor position correct at origin (y - up)');
    });
    test('Controller: setMode', function() {
      var editor;
      document.getElementById('test-main').innerHTML = '';
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      strictEqual('coffeescript', editor.getMode());
      editor.setMode('javascript');
      return strictEqual('javascript', editor.getMode());
    });
    test('Controller: setValue errors', function() {
      var editor;
      document.getElementById('test-main').innerHTML = '';
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      editor.setEditorState(true);
      editor.setValue('pen red\nspeed 30\nfor [1..30]\n  lt 90\n  lt 90, 20\n  if ``\n  ``\n  lt 90\n  lt 90, 20\n  dot blue, 15\n  dot yellow, 10\n  rt 105, 100\n  rt 90\n(((((((((((((((((((((((loop))))))))))))))))))))))) = (param) ->\n  ``');
      return strictEqual(editor.currentlyUsingBlocks, false);
    });
    return test('Controller: arbitrary row/column marking', function() {
      var editor, key;
      document.getElementById('test-main').innerHTML = '';
      editor = new droplet.Editor(document.getElementById('test-main'), {
        mode: 'coffeescript',
        palette: []
      });
      editor.setEditorState(true);
      editor.setValue('for [1..10]\n  alert 10 + 10\n  prompt 10 - 10\n  alert 10 * 10\n  prompt 10 / 10');
      key = editor.mark(2, 4, {
        color: '#F00'
      });
      strictEqual(editor.markedBlocks[key].model.stringify(), '10 - 10');
      strictEqual(editor.markedBlocks[key].style.color, '#F00');
      editor.unmark(key);
      return ok(!(key in editor.markedBlocks));
    });
  });

}).call(this);

//# sourceMappingURL=tests.js.map
