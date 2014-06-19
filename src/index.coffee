{spawn} = require "child_process"
gutil = require "gulp-util"

PLUGIN_NAME = "gulp-middleman"

class Middleman
  constructor: (options) ->
    @options = options

  getCommand: ->
    if @options.useBundler then "bundle" else "middleman"

  getArguments: (subcommand) ->
    args = if @options.useBundler then ["exec", "middleman"] else []
    args.push subcommand
    args.push "--verbose" if @options.verbose
    args.concat if subcommand == "server" then @getServerOptions() else @getOptions()
    args

  getServerOptions: ->
    opts = []
    opts.push "--environment=#{@options.environment}" if @options.environment
    opts.push "--host=#{@options.host}" if @options.host
    opts.push "--port=#{@options.port}" if @options.port
    opts

  getOptions: ->
    opts = []
    opts.push "--clean" if @options.clean
    opts.push "--glob=#{@options.glob}" if @options.glob
    opts

module.exports =
  server: (options = {}) ->
    middleman = new Middleman options

    child = spawn middleman.getCommand(), middleman.getArguments("server")
    child.stdout.pipe process.stdout
    child.stderr.pipe process.stderr
    process.stdin.on "end", ->
      child.stdin.end()
    child.stdout.on "end", ->
      process.stdin.end()

  build: (options = {}) ->
    middleman = new Middleman options

    child = spawn middleman.getCommand(), middleman.getArguments("build")
    child.stdout.pipe process.stdout
    child.stderr.pipe process.stderr
    process.stdin.on "end", ->
      child.stdin.end()
    child.stdout.on "end", ->
      process.stdin.end()
