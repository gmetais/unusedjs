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
        var CONSOLE_STYLE_USED = 'background: auto;';
        var CONSOLE_STYLE_UNUSED = 'background: #F99;';

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

                coveredFiles.forEach(function(file, fileIndex) {

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
                        console.log('File %d: %c%s of unused code for: %s (over %d statements)', fileIndex + 1, style, '' + (100 - percent).toFixed(1) + '%', file.path, allCount);

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
                    console.log('%c Total: %s of unused code (for the moment)', globalStyle, '' + (100 - globalPercent).toFixed(1) + '%');
                } else {
                    console.log('%c Global used code could not be calculated', CONSOLE_STYLE_GLOBAL_KO);
                }
            },

            file: function(fileIndex) {
                var i;

                // Return a string version of a number with leading 0
                function pad(num, size) {
                    var s = num+"";
                    while (s.length < size) s = "0" + s;
                    return s;
                }

                if (!fileIndex) {
                    console.warn('File index needed. Example: _unusedjs.showFile(2)');
                    return;
                }

                var index = fileIndex - 1;
                if (!coveredFiles[index]) {
                    console.warn('File index %d not found', fileIndex);
                    return;
                }

                var file = coveredFiles[index];
                console.log('%c File coverage for %s', CONSOLE_STYLE_GLOBAL_OK, file.path);

                
                // Grab all unused statements by line of code
                var lines = {};
                for (var statement in file.s) {
                    if (file.s[statement] === 0) {
                        var startLine = file.statementMap[statement].start.line;
                        var endLine = file.statementMap[statement].end.line;
                        for (i = startLine; i <= endLine ; i++) {
                            if (!lines[i]) {
                                lines[i] = {
                                    containsUnusedStatements: true,
                                    unusedStatements: [statement]
                                };
                            } else {
                                lines[i].unusedStatements.push(statement);
                            }
                        }
                    }
                }

                // For each line containing unused statements, find the unused chars
                for (var lineIndex in lines) {
                    var lineNumber = parseInt(lineIndex, 10);
                    var line = lines[lineNumber];

                    // Array pre-filled with 0
                    var unusedChars = [];
                    for (i = 0 ; i < file.code[lineNumber - 1].length ; i++) {
                        unusedChars[i] = 0;
                    }

                    line.unusedStatements.forEach(function(statementNumber) {
                        var statement = file.statementMap[statementNumber];
                        var startColumn = 0;
                        var endColumn = Infinity;
                        
                        if (statement.start.line < lineNumber) {
                            startColumn = 0;
                        } else {
                            startColumn = statement.start.column;
                        }

                        if (statement.end.line > lineNumber) {
                            endColumn = file.code[lineNumber - 1].length;
                        } else {
                            endColumn = statement.end.column;
                        }

                        for (i = startColumn ; i < endColumn ; i++) {
                            unusedChars[i] = 1;
                        }

                    });

                    lines[lineIndex].unusedChars = unusedChars;
                }

                // Display code
                var allCodeLines = [''];
                var consoleLogArgs = [];
                var maxDigits = file.code.length.toString().length;

                file.code.forEach(function(lineOfCode, index) {
                    var out = '%c' + pad(index + 1, maxDigits) + '. ';
                    consoleLogArgs.push(CONSOLE_STYLE_USED);

                    if (lines[index + 1] && lineOfCode.length > 0) {

                        var unusedChars = lines[index + 1].unusedChars;
                        var remainingLineOfCode = lineOfCode;
                        var transformedLineOfCode = '';
                        var colorsArgs = [];

                        while (unusedChars.length > 0) {
                            var isUnused = unusedChars[unusedChars.length - 1];
                            var lastChange = unusedChars.lastIndexOf(1 - isUnused) + 1;
                            unusedChars = unusedChars.slice(0, lastChange);
                            transformedLineOfCode = '%c' + remainingLineOfCode.substr(lastChange) + transformedLineOfCode;
                            colorsArgs.push(isUnused ? CONSOLE_STYLE_UNUSED : CONSOLE_STYLE_USED);
                            remainingLineOfCode = remainingLineOfCode.substr(0, lastChange);
                        }

                        out += transformedLineOfCode;
                        colorsArgs.reverse();
                        consoleLogArgs = consoleLogArgs.concat(colorsArgs);

                    } else {
                        out += lineOfCode;
                    }
                    
                    allCodeLines.push(out);
                });

                consoleLogArgs.unshift(allCodeLines.join('\n'));
                console.log.apply(console, consoleLogArgs);
            }
        };
    }());
}

if (__ISTANBUL_FAIL === true) {
    window._unusedjs.coverageFailed('__FILE_NAME__');
} else {
    window._unusedjs.newCoveredFile(__ISTANBUL_TOKEN__);
}