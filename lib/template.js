/* THIS IS THE ScriptTimingProxy CODE, INJECTED INTO YOUR SITE'S JAVASCRIPT FILES */
if (!window._STP) {
    window._STP = (function() {
        console.log('Initializing ScriptTimingProxy');

        var scripts = [];
        var buttonDiv, resultsDiv, resultsTable, uiIsOpen = false;

        var originalTime = window.performance.timing.navigationStart;
        var lastInteractionTime = Date.now();
        var hasChanged = true;

        var originalSetTimeout = window.setTimeout;
        var originalDocEvtListener = document.addEventListener;
        var originalWinEvtListener = window.addEventListener;
        
        function initUI() {
            createStylesheet();
            createSTPButtonDiv();
            createSTPResultsDiv();

            setInterval(refreshResultsTable, 1000);
        }

        function createStylesheet() {
            // Create a new stylesheet
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);

            style.sheet.insertRule('#STPButton, #STPResults * { color: #000; font-family: arial; text-align: left; }');
            style.sheet.insertRule('#STPButton { position: fixed; bottom: 0; right: 0; z-index: 999999999999999; width: 40px; height: 20px; line-height: 20px; background:#FC0; border-top: 1px solid #FFF; border-left: 1px solid #FFF; padding-left: 2px; font-size: 20px; font-weight: bold; cursor: pointer; }');
            style.sheet.insertRule('#STPResults { position: fixed; bottom: 0; left: 0; z-index: 999999999999999; width: calc(100% - 20px); max-height: 300px; background: #FFF; border-top: 1px solid #333; font-size: 10px; font-weight: bold; overflow: scroll; line-height: 14px; padding: 0 10px 15px; }');
            style.sheet.insertRule('#STPTitle { font-size: 16px; font-weight: bold; }');
            style.sheet.insertRule('#STPCloseButton { position: absolute; top: 5px; right: 5px; cursor: pointer; text-decoration: underline; }');
            style.sheet.insertRule('#STPResultsTable { margin-top: 10px; border: 1px solid #333; display: table; width: 100%; border-spacing: 2px; }');
            style.sheet.insertRule('#STPResultsTable .STPRow { display: table-row; }');
            style.sheet.insertRule('#STPResultsTable .STPRow > div { background: #F2F2F2; display: table-cell; }');
            style.sheet.insertRule('#STPResultsTable .STPScriptName { width: 300px; }');
            style.sheet.insertRule('#STPResultsTable .STPScriptName a { display: block; overflow: hidden; text-overflow: ellipsis; width: 300px; white-space: nowrap; font-size: 10px; }');
            style.sheet.insertRule('#STPResultsTable .STPTimeline { position: relative; }');
            style.sheet.insertRule('#STPResultsTable .STPDOMReady { background: #EBE; }');
            style.sheet.insertRule('#STPResultsTable .STPDOMComplete { background: #00F; }');
            style.sheet.insertRule('#STPResultsTable .STPOnLoad { background: #CCF; }');
            style.sheet.insertRule('#STPResultsTable .STPNavTiming { top: -1px; height: calc(100% + 2px); }');
            style.sheet.insertRule('#STPResultsTable .STPFragment { position: absolute; height: 100%; min-width: 1px; }');
            style.sheet.insertRule('#STPResultsTable .STPDownload { background: #AEA; }');
            style.sheet.insertRule('#STPResultsTable .STPParse { background: #C18; }');
            style.sheet.insertRule('#STPResultsTable .STPExecute { background: #FC0; }');
        }

        function createSTPButtonDiv() {
            buttonDiv = document.createElement('div');
            buttonDiv.id = 'STPButton';
            buttonDiv.innerHTML = 'STP';
            buttonDiv.onclick = openResults;
            document.body.appendChild(buttonDiv);
        }

        function createSTPResultsDiv() {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'STPResults';
            resultsDiv.style.display = 'none';
            resultsDiv.style.position = 'fixed';
            resultsDiv.innerHTML = '<h1 id="STPTitle">ScriptTimingProxy Results</h1><div id="STPCloseButton">Close [X]</div><div id="STPResultsTable"></div>';
            document.body.appendChild(resultsDiv);

            resultsTable = document.getElementById('STPResultsTable');

            document.getElementById('STPCloseButton').onclick = closeResults;
        }

        document.addEventListener("DOMContentLoaded", initUI, false);

        function openResults() {
            console.log('STP: Openning results');
            uiIsOpen = true;
            refreshResultsTable();
            resultsDiv.style.display = 'block';
            buttonDiv.style.display = 'none';
        }

        function closeResults() {
            console.log('STP: Closing results');
            uiIsOpen = false;
            resultsDiv.style.display = 'none';
            buttonDiv.style.display = 'block';
        }

        function calculateTimestampPercent(timestamp, min, max) {
            return (timestamp - min) * 100 / (max - min);
        }

        function calculateDurationPercent(duration, min, max) {
            return duration * 100 / (max - min);
        }

        function refreshResultsTable() {
            if (!uiIsOpen || !hasChanged) {
                return;
            }
            hasChanged = false;

            var rows = [];
            scripts.forEach(function(script) {

                var row = '<div class="STPRow">';
                row += '<div class="STPScriptName"><a href="' + script.url + '" target="_blank" title="' + script.url + '">' + script.url + '</a></div>';
                row += '<div class="STPTimeline">';
                if (window.performance.timing.domContentLoadedEventStart && window.performance.timing.domContentLoadedEventEnd) {
                    row += '<div class="STPFragment STPNavTiming STPDOMReady" title="DOM Ready event lasts for ' + (window.performance.timing.domContentLoadedEventEnd - window.performance.timing.domContentLoadedEventStart) + ' ms" style="left: ' + calculateTimestampPercent(window.performance.timing.domContentLoadedEventStart, originalTime, lastInteractionTime) + '%; width: ' + calculateDurationPercent(window.performance.timing.domContentLoadedEventEnd - window.performance.timing.domContentLoadedEventStart, originalTime, lastInteractionTime) + '%;"></div>';
                }
                if (window.performance.timing.domContentLoadedEventStart) {
                    row += '<div class="STPFragment STPNavTiming STPDOMComplete" title="DOM Complete event" style="left: ' + calculateTimestampPercent(window.performance.timing.domComplete, originalTime, lastInteractionTime) + '%; width: 2px;"></div>';
                }
                if (window.performance.timing.loadEventStart && window.performance.timing.loadEventEnd) {
                    row += '<div class="STPFragment STPNavTiming STPOnLoad" title="Page OnLoad event lasts for ' + (window.performance.timing.loadEventEnd - window.performance.timing.loadEventStart) + ' ms" style="left: ' + calculateTimestampPercent(window.performance.timing.loadEventStart, originalTime, lastInteractionTime) + '%; width: ' + calculateDurationPercent(window.performance.timing.loadEventEnd - window.performance.timing.loadEventStart, originalTime, lastInteractionTime) + '%;"></div>';   
                }
                row += '<div class="STPFragment STPDownload" title="Download time: ' + script.downloadTime + ' ms" style="left: ' + calculateTimestampPercent(script.downloadStart, originalTime, lastInteractionTime) + '%; width: ' + calculateDurationPercent(script.downloadTime, originalTime, lastInteractionTime) + '%;"></div>';
                row += '<div class="STPFragment STPParse" title="Parse time: ' + script.parseTime + ' ms" style="left: ' + calculateTimestampPercent(script.parseStart, originalTime, lastInteractionTime) + '%; width: ' + calculateDurationPercent(script.parseTime, originalTime, lastInteractionTime) + '%;"></div>';
                script.executions.forEach(function(execution) {
                    var tooltip = '';
                    switch(execution.type) {
                        case 'init':
                            tooltip = 'Initial execution time: ' + execution.time + ' ms';
                            break;
                        case 'DOMReady':
                            tooltip = 'Executing script on DOM Ready: ' + execution.time + ' ms';
                            break;
                        case 'pageLoad':
                            tooltip = 'Executing script on page loaded: ' + execution.time + ' ms';
                            break;
                        case 'setTimeout':
                            tooltip = 'Executing script from setTimeout(wait ' + execution.timeout + ' ms): ' + execution.time + ' ms';
                            break;
                    }
                    row += '<div class="STPFragment STPExecute" title="' + tooltip + '" style="left: ' + calculateTimestampPercent(execution.start, originalTime, lastInteractionTime) + '%; width: ' + calculateDurationPercent(execution.time, originalTime, lastInteractionTime) + '%;"></div>';
                });
                row += '</div>';
                row += '</div>';

                rows.push(row);
                
            });

            resultsTable.innerHTML = rows.join('');
        }

        function timeFn(fn, index, type, timeout) {
            return function() {
                var startTime = new Date().getTime();
                fn();
                var endTime = new Date().getTime();
                var duration = endTime - startTime;
                
                if (scripts[index] && scripts[index].executions) {
                    scripts[index].executions.push({
                        type: type,
                        timeout: timeout,
                        start: startTime,
                        end: endTime,
                        time: endTime - startTime
                    });

                    if (duration > 0) {
                        saveLastInteractionTime();
                    }
                }
            };
        }

        // Spy defering functions
        function spy(index) {

            document.addEventListener = function(event, fn, useCapture) {
                if (event === "DOMContentLoaded") {
                    originalDocEvtListener.call(document, event, timeFn(fn, index, 'DOMReady'), useCapture);
                } else {
                    originalDocEvtListener.call(document, event, fn, useCapture);
                }
            };

            window.addEventListener = function(event, fn, useCapture) {
                if (event === "load") {
                    originalWinEvtListener.call(window, event, timeFn(fn, index, 'pageLoad'), useCapture);
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

                arguments[0] = timeFn(fn, index, 'setTimeout', time);

                originalSetTimeout.apply(window, arguments);
            };
        }

        function unSpy() {
            window.setTimeout = originalSetTimeout;
            document.addEventListener = originalDocEvtListener;
            window.addEventListener = originalWinEvtListener;
        }

        function saveLastInteractionTime() {
            lastInteractionTime = Date.now() + 100;
            hasChanged = true;
        }

        return {
            start: function(index, url, weight, unGzipWeight) {
                scripts[index] = { 
                    parseStart: new Date().getTime(),
                    url: url,
                    weight: weight,
                    unGzipWeight: unGzipWeight,
                    executions: []
                };

                function getResourceTimings() {
                    // Get the download time from Resource Timing API
                    var resourceTimings = window.performance.getEntriesByType('resource');
                    var found = resourceTimings.some(function(resource) {
                        if (resource.name === scripts[index].url) {
                            scripts[index].downloadStart = Math.round(originalTime + resource.startTime);
                            scripts[index].downloadTime = Math.round(resource.duration);
                            scripts[index].downloadEnd = Math.round(originalTime + resource.startTime + resource.duration);
                            return true;  
                        }
                        return false;
                    });
                    if (!found) {
                        console.log('Resource timing not available for ' + scripts[index].url);
                    }
                    return found;
                }

                if (!getResourceTimings()) {
                    setTimeout(getResourceTimings, 2000);
                }

                saveLastInteractionTime();
            },
            parsed: function(index) {
                scripts[index].parseEnd = new Date().getTime();
                scripts[index].parseTime = scripts[index].parseEnd - scripts[index].parseStart;
                spy(index);
                saveLastInteractionTime();
            },
            end: function(index) {
                scripts[index].executeEnd = new Date().getTime();
                scripts[index].executions.push({
                    type: 'init',
                    start: scripts[index].parseEnd,
                    end: scripts[index].executeEnd,
                    time: scripts[index].executeEnd - scripts[index].parseEnd
                });
                unSpy();
                saveLastInteractionTime();
            }
        };
    }());
}

window._STP.start(__INDEX__, '__URL__', __WEIGHT__, __UNGZIPWEIGHT__);
try {
    eval("window._STP.parsed(__INDEX__);\n__BODY__");
    window._STP.end(__INDEX__);
} catch(err) {
    throw err;
}