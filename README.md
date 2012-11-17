# Gyppo

Simple AJAX file logging using [node.js](https://github.com/joyent/node) and [Winston](https://github.com/flatiron/winston/).

I wrote this as an AJAX backend for logging errors generated by applications running in the browser.  I wanted something that was completely independent of my core infrastructure to avoid burdening my application backend with such trivial traffic.

Winston supports more transports than I need.  For now I've written this to just use the File transport because that suits my purposes.  But there's no reason it can't be extended to use other transports fairly painlessly.

## Configuration

Change the defaults (port, user, log file location) in config.js to suit your needs.

## Usage

Boot your server:

node server.js

Then just POST to the server with params 'message' and optional 'level'.

> curl --data "level=error&message=blame%20canada" http://localhost:9000

or

``` js
$.ajax({
  url: "http://localhost:9000",
  type: "POST",
  data: { level: "error", message: "blame canada" },
  success: $.noop,
  error: $.noop
});
```

Winston will log some JSON like this:

> {"level":"error","message":"blame canada","timestamp":"2012-11-17T10:43:27.143Z"}

## Troubleshooting

Make sure your log file exists and is writable by the user you've specified in config.js