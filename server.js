/*
 * Gyppo - Simple Node.js AJAX File Logging Server
 */

var fs          = require('fs');
var path        = require('path');
var sys         = require('util');
var http        = require('http');
var winston     = require('winston');
var config      = require('./config')
var helpers     = require('./helpers');

// console transport is enabled by default but we don't need it
winston.remove(winston.transports.Console);

// we'd like use the file transport
winston.add(winston.transports.File, { filename: config.log_file, timestamp: true });

var server = http.createServer(function(req, res){
    // ensure we have a POST and that we have params
    helpers.postReq(req, res, function() {
        winston.log(res.post.level || config.default_level, res.post.message);

        // success!
        res.writeHead(204, {'Content-Type': 'text/plain'});
        res.end();
    });
}).listen(config.port);

// demote our process
if (config.gid && config.uid){
    process.setgid(config.gid);
    process.setuid(config.uid);
}

sys.puts('Gyppo listening on ' + config.port);
