(function() {
  var Middleman, PLUGIN_NAME, gutil, spawn;

  spawn = require("child_process").spawn;

  gutil = require("gulp-util");

  PLUGIN_NAME = "gulp-middleman";

  Middleman = (function() {
    function Middleman(options) {
      this.options = options;
    }

    Middleman.prototype.getCommand = function() {
      if (this.options.useBundler) {
        return "bundle";
      } else {
        return "middleman";
      }
    };

    Middleman.prototype.getArguments = function(subcommand) {
      var args;
      args = this.options.useBundler ? ["exec", "middleman"] : [];
      args.push(subcommand);
      if (this.options.verbose) {
        args.push("--verbose");
      }
      args.concat(subcommand === "server" ? this.getServerOptions() : this.getOptions());
      return args;
    };

    Middleman.prototype.getServerOptions = function() {
      var opts;
      opts = [];
      if (this.options.environment) {
        opts.push("--environment=" + this.options.environment);
      }
      if (this.options.host) {
        opts.push("--host=" + this.options.host);
      }
      if (this.options.port) {
        opts.push("--port=" + this.options.port);
      }
      return opts;
    };

    Middleman.prototype.getOptions = function() {
      var opts;
      opts = [];
      if (this.options.clean) {
        opts.push("--clean");
      }
      if (this.options.glob) {
        opts.push("--glob=" + this.options.glob);
      }
      return opts;
    };

    return Middleman;

  })();

  module.exports = {
    server: function(options) {
      var child, middleman;
      if (options == null) {
        options = {};
      }
      middleman = new Middleman(options);
      child = spawn(middleman.getCommand(), middleman.getArguments("server"));
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      process.stdin.on("end", function() {
        return child.stdin.end();
      });
      return child.stdout.on("end", function() {
        return process.stdin.end();
      });
    },
    build: function(options) {
      var child, middleman;
      if (options == null) {
        options = {};
      }
      middleman = new Middleman(options);
      child = spawn(middleman.getCommand(), middleman.getArguments("build"));
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
      process.stdin.on("end", function() {
        return child.stdin.end();
      });
      return child.stdout.on("end", function() {
        return process.stdin.end();
      });
    }
  };

}).call(this);
