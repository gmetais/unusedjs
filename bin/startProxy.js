#!/usr/bin/env node

var fs              = require('fs');
var path            = require('path');
var istanbul        = require('istanbul');
var HttpProxy       = require('../lib/httpProxy');

var instrumenter    = new istanbul.Instrumenter({
    embedSource: true,
    noAutoWrap: true
});

var proxy = new HttpProxy();
var port = 3838;
var template = fs.readFileSync(path.resolve(__dirname, '..', 'lib', 'template.js'), 'utf8');

proxy.start(port, function(bodyBuffer, transferWeight, ungzipedWeight, url, index) {
    var newBody = template;

    var instrumentedJS = bodyBuffer.toString();
    
    try {
        instrumentedJS = instrumenter.instrumentSync(instrumentedJS, url);

        var tokenFinder = /^\nvar (__cov_([^\s]+)) = \(Function\('return this'\)\)\(\);/.exec(instrumentedJS);
        var randomToken = tokenFinder[1];

        newBody = newBody.split('__ISTANBUL_FAIL').join('false');
        newBody = newBody.split('__ISTANBUL_TOKEN__').join(randomToken);

    } catch(err) {
        console.log('File %s could not be instrumented', url);

        newBody = newBody.split('__ISTANBUL_FAIL').join('true');
        newBody = newBody.split('__ISTANBUL_TOKEN__').join('""');
    }

    newBody = newBody.split('__FILE_NAME__').join(url);
    newBody = newBody.split('__BODY__').join(instrumentedJS);

    return new Buffer(newBody);
});

console.log('You can now configure your browser to use the proxy "localhost:3838"');