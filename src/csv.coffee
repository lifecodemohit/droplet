###
author : lifecodemohit
lang   : coffeescript
###
define ['droplet-helper', 'droplet-model', 'droplet-parser','csvscript'], (helper, model,parser,csvscript) ->
  class csvParser extends parser.Parser
    markRoot: ->
      tree=csvscript.parse(@text)
      console.log(tree)
      @mark 0, tree, 0

    getcolor: (node) ->
    	return 'violet'

    getSocketLevel: (node) -> helper.ANY_DROP

    getAcceptsRule: (node) -> default: helper.VALUE_ONLY
    
    getClasses: (node) ->
      switch node.type
        when 'each_node'
          return [node.type,'mostly-block']
        when 'each_node_node'
          return [node.type,'mostly-value']

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
      switch node.type
        when 'Program'
          for statement in node.body
            @mark indentDepth, statement, depth + 1
        when 'each_node' 
          @csvBlock node, depth
          for argument in node.node_list
            @csvSocketAndMark indentDepth, argument, depth + 1

    csvBlock: (node, depth) ->
      @addBlock
        bounds: @getBounds node
        depth: 0
        precedence: 0
        color: @getcolor node
        classes: @getClasses node
        socketLevel: @getSocketLevel node

    csvSocketAndMark: (indentDepth, node, depth, precedence, bounds) ->
      @addSocket
        bounds: bounds ? @getBounds node
        depth: depth
        precedence: precedence
        classes: @getClasses node
        accepts: @getAcceptsRule node

    csvParser.parens = (leading, trailing, node, context) ->
      return [leading, trailing]

    csvParser.drop = (block, context, pred) ->
      if context.type is 'socket'
        return helper.FORBID

  return parser.wrapParser csvParser