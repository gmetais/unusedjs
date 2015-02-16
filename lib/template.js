/* THIS SCRIPT WAS TRANSFORMED BY UnusedJSProxy */

__BODY__;


if (!window._unusedjs) {
    window._unusedjs = (function() {
        
        var coveredFiles = [];
        var failedFiles = [];

        var CONSOLE_STYLE_OK = 'color: #090;';
        var CONSOLE_STYLE_KO = 'color: #B00;';
        var CONSOLE_STYLE_FAIL = 'background: #900; color: #FFF;';
        var CONSOLE_STYLE_GLOBAL_OK = 'font-size: 1.5em; font-weight: bold; background: #090; color: #FFF;';
        var CONSOLE_STYLE_GLOBAL_KO = 'font-size: 1.5em; font-weight: bold; background: #B00; color: #FFF;';

        return {
            newCoveredFile: function(istanbulToken) {
                coveredFiles.push(istanbulToken);
            },

            coverageFailed: function(istanbulToken) {
                coveredFiles.push(istanbulToken);
            },

            report: function() {
                var globalAllCount = 0;
                var globalOkCount = 0;

                coveredFiles.forEach(function(file) {

                    var allCount = 0;
                    var okCount = 0;

                    for (var statement in file.s) {
                        allCount ++;
                        if (file.s[statement]) {
                            okCount++;
                        }
                    }

                    if (allCount > 0) {
                        var percent = Math.round(okCount * 1000 / allCount) / 10;
                        var style = (percent >= 50) ? CONSOLE_STYLE_OK : CONSOLE_STYLE_KO;
                        console.log('%c %f% of unused code for: %s (over %d statements)', style, 100 - percent, file.path, allCount);

                        globalAllCount += allCount;
                        globalOkCount += okCount;
                    } else {
                        console.log('No statement detected in file: %s', file.path);
                    }
                });

                failedFiles.forEach(function(fileName) {
                    console.log('%c Code coverage failed for: %s', CONSOLE_STYLE_FAIL, fileName);
                });

                if (globalAllCount > 0) {
                    var globalPercent = Math.round(globalOkCount * 1000 / globalAllCount) / 10;
                    var globalStyle = (globalPercent >= 50) ? CONSOLE_STYLE_GLOBAL_OK : CONSOLE_STYLE_GLOBAL_KO;
                    console.log('%c Total: %f% of unused code (for the moment)', globalStyle, 100 - globalPercent);
                } else {
                    console.log('%c Global used code could not be calculated', CONSOLE_STYLE_GLOBAL_KO);
                }
            }
        };
    }());
}

if (__ISTANBUL_FAIL === true) {
    window._unusedjs.coverageFailed('__FILE_NAME__');
} else {
    window._unusedjs.newCoveredFile(__ISTANBUL_TOKEN__);
}