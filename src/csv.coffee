define ['droplet-helper', 'droplet-parser'], (helper, parser) ->
  class csvParser extends parser.Parser
    markRoot: ->

  return parser.wrapParser csvParser