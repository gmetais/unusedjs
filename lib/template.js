if (!window._STP) {
    window._STP = (function() {
        var scripts = [];
        var timer = null;
        
        function resetTimer() {
            clearTimeout(timer || -1);
            timer = setTimeout(render, 5000);
        }
        
        function render() {
            var table = [];
            var totalWeight = totalUnGzipWeight = totalParse = totalExec = 0;

            scripts.forEach(function(script) {
                table.push({
                    'Script URL': script.url,
                    'File size (in bytes)': script.weight,
                    'Not gziped size (in bytes)': script.unGzipWeight,
                    'Parse Time (in ms)': (script.parsed - script.start),
                    'Execute Time (in ms)': (script.end - script.parsed)
                });
                totalWeight += script.weight;
                totalUnGzipWeight += script.unGzipWeight;
                totalParse += (script.parsed - script.start);
                totalExec += (script.end - script.parsed);
            });

            table.push({
                'Script URL': 'TOTAL',
                'File size (in bytes)': totalWeight,
                'Not gziped size (in bytes)': totalUnGzipWeight,
                'Parse Time (in ms)': totalParse,
                'Execute Time (in ms)': totalExec
            });

            console.log('ScriptTimingProxy for ' + window.location.href + ':');
            if (console.table) {
                console.table(table);
            } else {
                console.log(table);
            }

            table = [];
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
            },
            end: function(index) {
                scripts[index].end = new Date().getTime();
                resetTimer();
            }
        };
    }());
}

window._STP.start(__INDEX__, '__URL__', __WEIGHT__, __UNGZIPWEIGHT__);
eval("window._STP.parsed(__INDEX__);\n__BODY__");
window._STP.end(__INDEX__);