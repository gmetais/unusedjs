#!/usr/bin/env node

var fs              = require('fs');
var path            = require('path');
var jsStringEscape  = require('js-string-escape');
var HttpProxy       = require('../lib/httpProxy');


var proxy = new HttpProxy();
var port = 3838;
var template = fs.readFileSync(path.resolve(__dirname, '..', 'lib', 'template.js'), 'utf8');

proxy.start(port, function(bodyBuffer, transferWeight, ungzipedWeight, url, index) {
    var newBody = template;

    // Inspired by https://github.com/etsy/DeviceTiming
    newBody = newBody.split('__INDEX__').join(index);
    newBody = newBody.split('__URL__').join(url);
    newBody = newBody.split('__WEIGHT__').join(transferWeight);
    newBody = newBody.split('__UNGZIPWEIGHT__').join(ungzipedWeight);
    newBody = newBody.split('__BODY__').join(jsStringEscape(bodyBuffer));

    return new Buffer(newBody);
});

console.log('You can now configure your browser to use the proxy "localhost:3838"');