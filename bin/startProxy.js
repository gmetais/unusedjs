#!/usr/bin/env node

var jsStringEscape  = require('js-string-escape');
var HttpProxy       = require('../lib/httpProxy');

var proxy = new HttpProxy();
var port = 3838;

proxy.start(port, function(bodyBuffer, $url, $index) {

    // Inspired by https://github.com/etsy/DeviceTiming
    var head = new Buffer('window._STP = window._STP || [];\n' +
                          'window._STP[' + $index + '] = {start: new Date().getTime()};\n' +
                          'eval("window._STP[' + $index + '].parsed = new Date().getTime();\\n');

    var body = new Buffer(jsStringEscape(bodyBuffer));

    var foot = new Buffer('");\n' +
                          'window._STP[' + $index + '].end = new Date().getTime();' +
                          'console.log("ScriptTimingProxy [' + $url + ']\\n' +
                          ' - parse: " + (window._STP[' + $index + '].parsed - window._STP[' + $index + '].start) + " ms\\n' +
                          ' - execute: " + (window._STP[' + $index + '].end - window._STP[' + $index + '].parsed) + " ms");');

    return Buffer.concat([head, body, foot]);
});

console.log('You can now configure your browser to use the proxy "localhost:3838"');