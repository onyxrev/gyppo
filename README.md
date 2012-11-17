# Gyppo

Simple AJAX file logging using node.js and winston.

Winston supports more transports than I need.  For now I've written this to just use the File transport because that suits my purposes.  But there's no reason it can't be extended to use other transports fairly painlessly.

## Configuration

Change the defaults (port, user, log file location) in config.js to suit your needs.

## Usage

Just POST to the server with params 'message' and optional 'level'.

curl --data "level=error&message=blame%20canada" http://localhost:9000
