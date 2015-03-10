readFile = (name) ->
  q = new XMLHttpRequest()
  q.open 'GET', name, false
  q.send()
  return q.responseText

require.config
  baseUrl: '../js'
  paths: JSON.parse readFile '../requirejs-paths.json'

require ['droplet'], (droplet) ->

  # Example palette
  window.editor = new droplet.Editor document.getElementById('editor'), {
    # CSV TESTING:
    mode: 'csvparser'
    modeOptions: {
    }

    palette: [
      {
        name: 'Sample blocks'
        color: 'green'
        blocks: [
                {
                  block: "monday,4.0,frank",
                  title: "Sample Text 1"
                },
                {
                  block: "tuesday,2.3,sally",
                  title: "Sample Text 2"
                },
                {
                  block: "wednesday,1.8,carol",
                  title: "Sample Text 3"
                },
                {
                  block: "//Sample comment",
                  title: "Comment"
                }
              ]
      }
    ]
  }

  examplePrograms = {
    sample1: '''
    //Sample 1 program
    basic,simple,text
    space, separated ,text
    quoted, "text ,handled"
    '''
    sample2: '''
    //Sample 2 Program
    monday,4.0,frank
    tuesday,2.3,sally
    wednesday,1.8,carol
    '''
    wikipedia_example: '''
    //Wikipedia Example
    Year,Make,Model,Description,Price
    1997,Ford,E350,"ac, abs, moon",3000.00
    1999,Chevy,"Venture ""Extended Edition""","",4900.00
    1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00
    1996,Jeep,Grand Cherokee,"MUST SELL!air, moon roof, loaded",4799.00
    '''
    empty: ''
  }

  editor.setEditorState false
  editor.aceEditor.getSession().setUseWrapMode true

  # Initialize to starting text
  startingText = localStorage.getItem 'example'
  editor.setValue startingText or examplePrograms.sample1

  # Update textarea on ICE editor change
  onChange = ->
    localStorage.setItem 'example', editor.getValue()

  editor.on 'change', onChange

  editor.aceEditor.on 'change', onChange

  # Trigger immediately
  do onChange

  document.getElementById('which_example').addEventListener 'change', ->
    editor.setValue examplePrograms[@value]

  editor.clearUndoStack()

  messageElement = document.getElementById 'message'
  displayMessage = (text) ->
    messageElement.style.display = 'inline'
    messageElement.innerText = text
    setTimeout (->
      messageElement.style.display = 'none'
    ), 2000

  document.getElementById('toggle').addEventListener 'click', ->
    editor.toggleBlocks()
