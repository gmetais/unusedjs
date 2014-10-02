if (!window._STP) {
    window._STP = (function() {
        var scripts = [];
        var timer = null;
        var originalSetTimeout = window.setTimeout;
        var originalDocEvtListener = document.addEventListener;
        var originalWinEvtListener = window.addEventListener;
        
        function resetTimer() {
            clearTimeout(timer || -1);
            timer = setTimeout(render, 5000, '__STP');
        }
        
        function render() {
            var table = [];
            var totalWeight = 0;
            var totalUnGzipWeight = 0;
            var totalParse = 0;
            var totalExec =0;
            var totalDefer = 0;

            scripts.forEach(function(script) {
                table.push({
                    'Script URL': script.url,
                    'File size (in bytes)': script.weight,
                    'Not gziped size (in bytes)': script.unGzipWeight,
                    'Parse Time (in ms)': (script.parsed - script.start),
                    'Execute Time (in ms)': (script.end - script.parsed),
                    'Defered Time (in ms)': script.defered
                });
                totalWeight += script.weight;
                totalUnGzipWeight += script.unGzipWeight;
                totalParse += (script.parsed - script.start);
                totalExec += (script.end - script.parsed) || 0;
                totalDefer += script.defered || 0;
            });

            table.push({
                'Script URL': 'TOTAL',
                'File size (in bytes)': totalWeight,
                'Not gziped size (in bytes)': totalUnGzipWeight,
                'Parse Time (in ms)': totalParse,
                'Execute Time (in ms)': totalExec,
                'Defered Time (in ms)': totalDefer
            });

            console.log('ScriptTimingProxy for ' + window.location.href + ':');
            if (console.table) {
                console.table(table);
            } else {
                console.log(JSON.stringify(table, null, 4));
            }

            table = [];
        }

        function timeFn(fn, index) {
            return function() {
                var startTime = new Date().getTime();
                fn();
                var duration = new Date().getTime() - startTime;
                
                if (scripts[index]) {
                    if (scripts[index].defered) {
                        scripts[index].defered += duration;
                    } else {
                        scripts[index].defered = duration;
                    }
                }
            };
        }

        // Spy defering functions
        function spy(index) {

            document.addEventListener = function(event, fn, useCapture) {
                if (event === "DOMContentLoaded") {
                    originalDocEvtListener.call(document, event, timeFn(fn, index), useCapture);
                } else {
                    originalDocEvtListener.call(document, event, fn, useCapture);
                }
            };

            window.addEventListener = function(event, fn, useCapture) {
                if (event === "load") {
                    originalWinEvtListener.call(window, event, timeFn(fn, index), useCapture);
                } else {
                    originalWinEvtListener.call(window, event, fn, useCapture);
                }
            };

            window.setTimeout = function(fn, time, otherArgs) {
                if (otherArgs === '__STP') {
                    // Block autoloop (happend once)
                    return;
                }

                if (typeof fn == 'string' || fn instanceof String) {
                    fn = function() { eval(fn); };
                }

                arguments[0] = timeFn(fn, index);

                originalSetTimeout.apply(window, arguments);
            };
        }

        function unSpy() {
            window.setTimeout = originalSetTimeout;
            document.addEventListener = originalDocEvtListener;
            window.addEventListener = originalWinEvtListener;
        }

        return {
            start: function(index, url, weight, unGzipWeight) {
                scripts[index] = { 
                    start: new Date().getTime(),
                    url: url,
                    weight: weight,
                    unGzipWeight: unGzipWeight
                };
            },
            parsed: function(index) {
                scripts[index].parsed = new Date().getTime();
                spy(index);
            },
            end: function(index) {
                scripts[index].end = new Date().getTime();
                unSpy();
                resetTimer();
            }
        };
    }());
}

window._STP.start(__INDEX__, '__URL__', __WEIGHT__, __UNGZIPWEIGHT__);
eval("window._STP.parsed(__INDEX__);\n__BODY__");
window._STP.end(__INDEX__);