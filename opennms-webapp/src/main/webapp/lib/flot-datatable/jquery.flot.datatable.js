// Initial implementation by Andrew Hudik (2015)
(function ($) {
 "use strict";
var options = {
    datatable: {
        xaxis: {
            label: 'X',
            format: d3.format(".2f")
        },
        yaxis: {
            label: 'Y',
            ignoreColumnsWithNoLabel: false,
            format: d3.format(".2f")
        }
    }
};

function getLabelForXAxis(series, options) {
    if (series.xaxis.options.axisLabel) {
        return series.xaxis.options.axisLabel;
    }
    return options.datatable.xaxis.label;
}

function getLabelForYAxis(series, options, suffix) {
    if (series.label !== undefined && series.label !== null) {
        return series.label;
    }
    if (series.yaxis.options.axisLabel) {
        return series.yaxis.options.axisLabel;
    }
    return options.datatable.yaxis.label + suffix;
}

function createTable(allSeries, options, useRawValues) {

    var identity = function(e) { return e;},
        xformat = useRawValues ? identity : options.datatable.xaxis.format,
        yformat = useRawValues ? identity : options.datatable.yaxis.format;

    var T = '<tr><th align="left">' + getLabelForXAxis(allSeries[0], options) + '</th>',
        t = '',
        i, j, N, M;

    for (j = 0, N = allSeries.length; j < N; j++) {
        if (allSeries[j].nodatatable) {
            continue;
        }
        T += '<th align="left">' + getLabelForYAxis(allSeries[j], options, j) + '</th>';
    }

    T += '</tr>';
    for (i = 0, N = allSeries[0].data.length; i < N; i++) {      // for each x
        t = '<tr><td nowrap>' + xformat(allSeries[0].data[i][0]) + '</td>';    // 1st colunm, x-value
        for (j = 0, M = allSeries.length; j < M; j++) {         // for each series
            if (allSeries[j].nodatatable) {
                continue;
            }
            t += '<td nowrap>' + yformat(allSeries[j].data[i][1]) + '</td>'; // add y-data
        }
        t += '</tr>';
        T += t;
    }

    return T;
}

function init(plot) {

    // Add the styles
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".flot-datatable-tab { display: inline; border: 1px solid black; border-bottom: 0; padding: 2px 5px 2px 5px; margin-left: 3px; border-radius: 4px 4px 0 0; cursor: pointer; } .flot-datatable-tab:hover { background-color: #DDDDDD; }";
    document.head.insertBefore(css, document.head.firstChild);

    plot.hooks.drawOverlay.push(function (plot) {
        var placeholder = plot.getPlaceholder();
        // Only render the tabs on the first call
        if (placeholder.parent().find("#dataTab").length > 0) {
            return;
        }

        var tabs = $('<div class="flot-datatable-tabs" align="right"><div class="flot-datatable-tab" id="graphTab">Graph</div><div class="flot-datatable-tab" id="dataTab">Data</div></div>');
        var panel = $('<div title="Doubleclick to copy" class="flot-datatable-data" style="width: ' + placeholder[0].clientWidth + 'px; height: ' + placeholder[0].clientHeight + 'px; padding: 0px; position: relative; overflow: scroll; background: white; z-index: 10; display: none; text-align: left;">' +
            '<input type="checkbox" name="raw" value="raw">Raw values<br>' +
            '<table style="width: 100%"></table>' +
            '</div>');

        // Wrap the placeholder in an outer div and prepend the tabs
        placeholder.wrap("<div></div>")
            .before(tabs)
            .append(panel);

        // Copy the placeholder's style and classes to our newly created wrapper
        placeholder.parent()
            .attr('class', placeholder.attr('class'))
            .attr('style', placeholder.attr('style'))
            // Remove the height attribute
            .css("height", "");

        var checkbox = panel.find(":checkbox");
        var table = panel.find("table");

        var redrawTable = function() {
            table.html(createTable(plot.getData(), plot.getOptions(), checkbox.is(':checked')));
        };
        redrawTable();

        bindTabs(tabs, panel);
        bindCheckbox(checkbox, redrawTable);
        bindTable(table);
    });

    function bindTabs(tabs, table) {
        tabs.click(function (e) {
            switch (e.target.id) {
                case 'graphTab':
                    table.hide();
                    break;
                case 'dataTab':
                    table.show();
                    break;
            }
        });
    }

    function bindCheckbox(checkbox, redrawTable) {
        checkbox.change(function() {
            redrawTable();
        });
    }

    function bindTable(table) {
        table.bind('dblclick', function () {
            highlightTableRows(table);
        });
    }

    function highlightTableRows(table) {
        var selection = window.getSelection(),
            range = document.createRange();
        range.selectNode(table.get()[0]);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'datatable',
        version: '1.0.3'
    });
})(jQuery);