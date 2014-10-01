# ScriptTimingProxy

Mesure scripts parse and execution time with this simple browser proxy


## Why should i use ScriptTimingProxy ?

You're a web developer and you probably wonder what's the impact of the scripts your load on your pages.
And it's hard to know.


## How does it work ?

1. The proxy intercepts incoming javascript files.
2. The content of the script is injected into an eval() function, so we can measure the parse time (not exactly the same, but close).
3. The execution time is measured too, and the results are sent to the console.

It's totally inspired by a brilliant idea from Daniel Espeset (Etsy): [http://talks.desp.in/unpacking-the-black-box/](http://talks.desp.in/unpacking-the-black-box/)


## Be careful, the proxy is not working with HTTPS files. It doesn't even tunnel them, so any HTTPS page or HTTPS ressource will be blocked.

(If you know how to fix this, please give me your advice)


## Installation

```bash
npm install script-timing-proxy -g
```

## Use

1. Start the server: 
```
script-timing-proxy
```

2. Configure your browser's proxy to `localhost:3838`

3. Open your browser's console and load the page


## Results

```
ScriptTimingProxy [http://foo.com/replace/jquery/1.7/jquery.min.js]
 - parsing: 12 ms
 - execute: 9 ms

ScriptTimingProxy [http://foo.com/js/js_b0gYJf-p7oHc4hb4753wEL1s0LGUJJfZHT_0yZ_RS-8.js]
 - parsing: 1 ms
 - execute: 2 ms

ScriptTimingProxy [http://foo.com/replace/ui/ui/minified/jquery-ui.min.js]
 - parsing: 17 ms
 - execute: 6 ms

ScriptTimingProxy [http://foo.com/js/js_xnwCz-Url5H5ktFeoly_WayIlbocUn7TI0nqzJxfmdg.js]
 - parsing: 5 ms
 - execute: 0 ms

ScriptTimingProxy [http://foo.com/libraries/leaflet/leaflet.js?ncrmfd]
 - parsing: 14 ms
 - execute: 23 ms

 ...
 ```


## Author
Gaël Métais. I'm a webperf freelance based in Paris. If you understand french, you can visit [my website](http://www.gaelmetais.com).
