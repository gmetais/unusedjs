/**
 * A "Man in the middle" proxy, that modifies Javascript files for parsing and execution timings prupose.
 */

var HttpProxy = function() {
    'use strict';

    var http            = require('http');
    var connect         = require('connect');
    var httpProxy       = require('http-proxy');
    var url             = require('url');
    var zlib            = require('zlib');

    var host = 'localhost';
    var server = null;
    var proxy = null;
    var app = null;
    var index = 0;

    return {

        /**
         * Starts the server and sets a modify function, called for each intercepted script
         * 
         * The following parameters are injected into the function:
         * 
         * @param bodyBuffer {Buffer}   A buffer containing the body. You can use bodyBuffer.toString().
         * @param scriptUrl {String}    The url of the script.
         * @param index {Integer}       A unique integer for the file.
         * 
         * The function must return a Buffer
         */
        start: function(port, modifyFn) {

            // The node-http-proxy (https://github.com/nodejitsu/node-http-proxy)
            proxy = httpProxy.createProxyServer({});

            // This is needed to avoid the "socket hang up" error when a request is canceled
            proxy.on('error', function (err, req, res) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Something went wrong');
            });

            // The middleware layer
            app = connect();

            // Middleware that intercepts the content body
            app.use(function (req, res, next) {
                
                // Save these functions which will be overriden
                var _write = res.write;
                var _end = res.end;
                var _writeHead = res.writeHead;

                // Save the previously set headers
                var _statusCode = null;
                var _headers = {};

                // Response buffer
                var buffer = null;

                // Override res.write
                res.write = function (data) {
                    buffer = buffer === null ? data : Buffer.concat([buffer, data]);
                };

                // Override res.end
                res.end = function() {
                    if (!buffer) {
                        sendResponse(_statusCode, _headers);
                        return;
                    }

                    if (isJavascript()) {

                        if (isGziped()) {
                            
                            // Unzip the file
                            zlib.gunzip(buffer, function(err, dezipped) {
                                if (err) {
                                    // Ungzip failed
                                    console.log('Could not ungzip ' + req.url);
                                    sendResponse(_statusCode, _headers, buffer);
                                } else {

                                    // Ungzip succeed
                                    // Transform!
                                    var newBody = modifyFn(dezipped, req.url, index);

                                    // Re-gzip
                                    zlib.gzip(newBody, function(err, zipped) {
                                        if (err) {
                                            // Oops, re-zip failed, WTF?!?
                                            console.log('Could not re-gzip something that was correctly ungziped!!!');
                                            console.log(err);
                                            sendResponse(_statusCode, _headers, buffer);
                                        } else {
                                            _headers['content-length'] = zipped.length;
                                            sendResponse(_statusCode, _headers, zipped);
                                        }
                                    });
                                }
                            });

                        } else {
                            // Not gziped
                            // Transform!
                            var newBody = modifyFn(buffer, req.url, index);
                            _headers['content-length'] = newBody.length;
                            sendResponse(_statusCode, _headers, newBody);

                        }

                        index ++;
                    } else {
                        // Not a JS file
                        sendResponse(_statusCode, _headers, buffer);
                    }
                };
                // Override res.writeHead
                res.writeHead = function(statusCode) {
                    _statusCode = statusCode;
                };
                // Override res.setHeader
                res.setHeader = function(name, value) {
                    _headers[name.toLowerCase()] = value;
                };

                function sendResponse(statusCode, headers, body) {
                    _writeHead.call(res, statusCode, headers);
                    if (body) {
                        _write.call(res, body);
                    }
                    _end.call(res);
                }

                function isJavascript() {
                    var contentType = (_headers['content-type'] || '').split(';').shift().toLowerCase();
                    return contentType == 'application/x-javascript' ||
                           contentType == 'application/javascript' ||
                           contentType == 'text/javascript';
                }

                function isGziped() {
                    var contentEncoding = _headers['content-encoding'];
                    return contentEncoding && contentEncoding === 'gzip';
                }

                next();
            });

            // Proxify the requests
            app.use(function(req, res) {
                var reqUrl = url.parse(req.url);
                var target = reqUrl.protocol + '//' + reqUrl.host;
                proxy.web(req, res, { target: target });
            });

            server = http.createServer(app).listen(port);
            console.log('Proxy listening on port ' + port);
        },

        stop: function() {
            proxy.close();
            server.close();
            console.log('Proxy stopped');
        }
    };
};

module.exports = HttpProxy;