(function() {
  var readFile;

  readFile = function(name) {
    var q;
    q = new XMLHttpRequest();
    q.open('GET', name, false);
    q.send();
    return q.responseText;
  };

  require.config({
    baseUrl: '../js',
    paths: JSON.parse(readFile('../requirejs-paths.json'))
  });

  require(['droplet'], function(droplet) {
    var displayMessage, examplePrograms, messageElement, onChange, startingText;
    window.editor = new droplet.Editor(document.getElementById('editor'), {
      mode: 'csvparser',
      modeOptions: {},
      palette: [
        {
          name: 'Sample blocks',
          color: 'green',
          blocks: [
            {
              block: "monday,4.0,frank",
              title: "Sample Text 1"
            }, {
              block: "tuesday,2.3,sally",
              title: "Sample Text 2"
            }, {
              block: "wednesday,1.8,carol",
              title: "Sample Text 3"
            }, {
              block: "//Sample comment",
              title: "Comment"
            }
          ]
        }
      ]
    });
    examplePrograms = {
      sample: 'monday,4.0,frank\ntuesday,2.3,sally\nwednesday,1.8,carol',
      empty: ''
    };
    editor.setEditorState(false);
    editor.aceEditor.getSession().setUseWrapMode(true);
    startingText = localStorage.getItem('example');
    editor.setValue(startingText || examplePrograms.sample);
    onChange = function() {
      return localStorage.setItem('example', editor.getValue());
    };
    editor.on('change', onChange);
    editor.aceEditor.on('change', onChange);
    onChange();
    document.getElementById('which_example').addEventListener('change', function() {
      return editor.setValue(examplePrograms[this.value]);
    });
    editor.clearUndoStack();
    messageElement = document.getElementById('message');
    displayMessage = function(text) {
      messageElement.style.display = 'inline';
      messageElement.innerText = text;
      return setTimeout((function() {
        return messageElement.style.display = 'none';
      }), 2000);
    };
    return document.getElementById('toggle').addEventListener('click', function() {
      return editor.toggleBlocks();
    });
  });

}).call(this);

//# sourceMappingURL=example-csv.js.map
