define ['droplet-helper', 'droplet-model', 'droplet-parser','csvscript'], (helper, model,parser,csvscript) ->
  class csvParser extends parser.Parser
    markRoot: ->
      tree=csvscript.parse(@text)
      console.log(tree)
      @mark 0, tree, 0
    getSocketLevel: (tree) -> helper.ANY_DROP
    getAcceptsRule: (tree) -> default: helper.VALUE_ONLY
    getBounds: (node) ->
      bounds = {
        start: {
          line: node.loc.start.line
          column: node.loc.start.column
        }
        end: {
          line: node.loc.end.line
          column: node.loc.end.column
        }
      }
      return bounds
    
    getSocketBounds: (tree) ->
      bounds = {
        start: {
          line: tree.loc.start.line
          column: tree.loc.start.column
        }
        end: {
          line: tree.loc.end.line
          column: tree.loc.end.column
        }
      }
      return bounds

    mark: (indentDepth, node, depth) ->
      if node.type == 'Program'
          for statement in node.body
            console.log(statement)
            @mark indentDepth, statement, depth + 1
      if node.type == 'each_node' 
        @csvBlock node, depth
        for argument in node.node_list
          @csvSocketAndMark indentDepth, argument, depth + 1

    csvBlock: (node, depth) ->
      @addBlock
        bounds: @getBounds node
        depth: 0
        precedence: 0
        color: 'value'
        classes: []
        socketLevel: @getSocketLevel node

    csvSocketAndMark: (indentDepth, node, depth, precedence, bounds) ->
      @addSocket
        bounds: bounds ? @getBounds node
        depth: depth
        precedence: precedence
        classes: []
        accepts: @getAcceptsRule node
    csvParser.parens = (leading, trailing, node, context) ->
      return [leading, trailing]

  return parser.wrapParser csvParser