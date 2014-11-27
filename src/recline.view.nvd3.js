/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

my.nvd3 = Backbone.View.extend({

    template:'<div class="recline-graph"> \
    {{data}} \
      <div class="panel nvd3graph_{{viewId}}"style="display: block;"> \
        <div id="nvd3chart_{{viewId}}"> \
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="{{width}}" height="{{height}}"> \
            </svg></div>\
      </div> \
    </div> ',

    initialize:function (options) {
        var self = this;

        this.uid = options.id || ('' + new Date().getTime() + Math.floor(Math.random() * 10000)); // generating an unique id for the chart
        this.el = $(this.el);
         _.bindAll(this, 'render');

        var stateData = _.extend({
                group:null,
                seriesNameField:[],
                seriesValues:[],
                colors:['#edc240', '#afd8f8', '#cb4b4b', '#4da74d', '#9440ed'],
                graphType: 'pieChart',
                id:0
            },
            this.options.state
        );
        //this validation should be triggered everytime model changes.
        this.validateState(stateData);
        this.state = new recline.Model.ObjectState(stateData);

    },
    validateState: function(options) {
        var graphType = options.graphType;
        var requiredFields = ['xfield', 'seriesFields'];
        this.validateFields(graphType, requiredFields, options);
    },
    validateFields: function(graphType, requiredFields, options) {
        requiredFields.forEach(function(field) {
            if (typeof options[field] == 'undefined' || options[field] == '') {
            }
        });
    },
    clear: function() {
        var self = this;
        var svgElem = self.el.find('#nvd3chart_' + self.uid + 'svg');
        $(svgElem).empty();
    },
    render:function () {
        var self = this;

        var tmplData = this.model.toTemplateJSON();
        tmplData['viewId'] = this.uid;

        if (this.state.get('width'))
            tmplData.width = this.state.get('width');

        if (this.state.get('height'))
            tmplData.height = this.state.get('height');

        var htmls = Mustache.render(this.template, tmplData);
        $(this.el).html(htmls);
        this.$graph = this.el.find('.panel.nvd3graph_' + tmplData['viewId']);
        self.trigger('chart:endDrawing');

        var records = this.model.records.models;

        var graphType = self.state.get('graphType');
        self.data = this.createSeries(graphType, records);

        nv.addGraph(function() {
            self.chart = self.getGraph[graphType](self);
            self.chart.height(self.state.get('height'));
            self.chart.width(self.state.get('width'));
            d3.select('#nvd3chart_' + self.uid + ' svg')
                .datum(self.data)
                .transition().duration(1200)
                .call(self.chart);
            self.chart.update();
        });

        return this;
    },
    getActionsForEvent:function (eventType) {
        var actions = [];
        _.each(this.options.actions, function (d) {
            if (_.contains(d.event, eventType))
                actions.push(d);
        });

        return actions;
    },

    redraw:function () {

    },
    createSeries: function(graphType, records) {
        var self = this;
        var results = [];
        self.chartMap = null;
        var xfield = self.state.get('xfield').toLowerCase();
        switch(graphType) {
            // These can be correctly grouped.
            case 'multiBarChart':
            case 'multiBarWithBrushChart':
            case 'multiBarHorizontalChart':

                var seriesFields = self.state.get('seriesFields');
                var initResults = {};
                var results = [];
                var groupResults = [];

                _.each(seriesFields, function(field) {
                    results.push({
                        key: field,
                        values: self.recordsToGraph(records, self.state.get('group'), xfield, field),
                    });
                });
                break;

            // These need a map for the X-Axis to work.
            case 'scatterChart':
            case 'lineWithFocusChart':
            case 'lineChart':
            case 'stackedAreaChart':
            case 'linePlusBarWithFocusChart':
            case 'lineWithBrushChart':

                self.chartMap = d3.map();
                var seriesFields = self.state.get('seriesFields');
                var initResults = {};
                var results = [];
                var groupResults = [];
                 _.each(seriesFields, function(field) {
                    var xCount = 0;
                    _.each(records, function(record) {
                        if (_.isUndefined(initResults[field])) {
                            initResults[field] = [];
                        };
                        self.chartMap.set(xCount, record.get(xfield));
                        initResults[field].push({
                            x: xCount,
                            y: record.get(field)
                        });
                        xCount++;
                    });
                });
                i = 0;
                _.each(initResults, function(values, key) {
                    results[i] = {
                        key: key,
                        values: values
                    };
                    i++;
                });
                break;

            // These can only have a single xfield.
            case 'discreteBarChart':
            case 'pieChart':
                var yfield = self.state.get('seriesFields')[0].toLowerCase();
                results = self.recordsToGraph(records, self.state.get('group'), xfield, yfield);
                if (graphType == 'discreteBarChart') {
                    results = [{ key: 'Bar Chart', values: results}];
                }
                break;
        }
        return results;
    },
    recordsToGraph: function  (records, group, xfield, yfield) {
        var results = _.map(records, function  (record) {
            if(record.get(xfield) && record.get(yfield)) {
                return  {x: record.get(xfield), y: record.get(yfield)};
            }
            return false;
        });
        results = _(results).without(undefined);

        if (group) {
            var groups = _(results).groupBy('x');
            var grouped = _(groups).map(function(g, key) {
              var y = _(g).reduce(function(m, item) { return m + item.y; }, 0);
              return {x: key, y: y};
            });
            results = grouped;
        }
        return results;
    },
    graphResize:function () {
        var self = this;
        var viewId = this.uid;

        if (!self.$el.is(':visible'))
            return;

        // this only works by previously setting the body height to a numeric pixel size (percentage size don't work)
        // so we assign the window height to the body height with the command below
        var container = self.el;
        while (!container.hasClass('container-fluid') && !container.hasClass('container') && container.length)
            container = container.parent();

        if (container
                && (container.hasClass('container') || container.hasClass('container-fluid'))
                && container[0].style && container[0].style.height
                && container[0].style.height.indexOf('%') > 0)
        {
            $(document.body).height($(window).innerHeight() - 10);

            var currAncestor = self.el;
            while (!currAncestor.hasClass('row-fluid') && !currAncestor.hasClass('row'))
                currAncestor = currAncestor.parent();

            if (currAncestor && (currAncestor.hasClass('row-fluid') || currAncestor.hasClass('row'))) {
                var newH = currAncestor.height();
                $('#nvd3chart_' + viewId).height(newH);
                $('#nvd3chart_' + viewId + '  svg').height(newH);
            }
        }
        if (self.chart && self.chart.update)
            self.chart.update(); // calls original 'update' function
    },
    setOptions:function (chart) {
        var self = this;
        var options = self.state.get('options');
        _(_.keys(options)).each(function(optionName){
            var optionValue = options[optionName];
            if(_.isFunction(chart[optionName])){
                chart[optionName](optionValue);
            }
        });
    },
    setAxis:function (axis, chart) {
        var self = this;

        if (axis == 'all' || axis == 'x') {
            var xLabel = self.state.get('xLabel');

            var xAxisFormat = function(str) {return str;}

            // axis are switched when using horizontal bar chart
            if (self.state.get('graphType').indexOf('Horizontal') < 0)
            {
                var xfield = self.model.fields.get(self.state.get('xfield'));
                xAxisFormat = self.state.get('tickFormatX') || xAxisFormat;
                if (_.isNull(xLabel) || xLabel == '' || _.isUndefined(xLabel))
                    xLabel = xfield.get('label');
            }
            else
            {
                xLabel = self.state.get('yLabel');
                if (self.state.get('tickFormatY'))
                    xAxisFormat = self.state.get('tickFormatY');
            }

            xAxisFormat = function(id) {
                if (self.chartMap) {
                    return self.chartMap.get(id);
                }
                else {
                    return id;
                }
            };

            chart.xAxis
                .axisLabel(xLabel)
                .tickFormat(xAxisFormat);

        }
        if (axis == 'all' || axis == 'y') {
            var yLabel = self.state.get('yLabel');
            var yAxisFormat = function(str) {return str;}
            // axis are switched when using horizontal bar chart
            if (self.state.get('graphType').indexOf('Horizontal') >= 0)
            {
                var yfield = self.model.fields.get(self.state.get('group'));
                yAxisFormat = self.state.get('tickFormatX') || self.getFormatter(yfield.get('type'))
                yLabel = self.state.get('xLabel');
            }
            else
            {
                if (self.state.get('tickFormatY'))
                    yAxisFormat = self.state.get('tickFormatY');

                if (yLabel == null || yLabel == '' || _.isUndefined(yLabel))
                    yLabel = self.state.get('seriesFields').join('/');
            }

            chart.yAxis
                .axisLabel(yLabel)
                .axisLabelDistance(40)
                .tickFormat(yAxisFormat);
        }
    },
    getFormatter: function(type) {
        var self = this;
        switch(type)
        {
        case 'string': return d3.format(',s');
        case 'float': return d3.format(',r');
        case 'integer': return d3.format(',r');
        case 'date': return d3.time.format('%x');
        }
    },

    addOption:{
        tooltip: function(chart, value) {
            var t = function(key, x, y, e, graph) {
                return value.replace('{x}', x)
                    .replace('{y}', y)
                    .replace('{key}', key);
            };
            chart.tooltip(t);
        },
        minmax:function (chart, value) {
        },
        trendlines:function (chart, value) {
        },
        showControls:function(chart, value) {
            if (chart.showControls)
                chart.showControls(value);
        },
        customTooltips:function (chart, value) {
        },
        stacked:function(chart, value) {
            chart.stacked(value);
        },
        grouped:function(chart, value) {
            chart.stacked(!value);
        },
    },
    getGraph: {
        multiBarChart:function (view) {
            var chart;
            chart = nv.models.multiBarChart().reduceXTicks(false) ;
            view.setAxis('all', chart);

            var actions = '';
            if (actions.length > 0)
            {
                chart.multibar.dispatch.on('elementClick', function (e) {
                    view.doActions(actions, [e.point.record]);
                });
            }

            var actionsH = '';
            if (actionsH.length > 0)
            {
                chart.multibar.dispatch.on('elementMouseover', function (e) {
                    view.doActions(actionsH, [e.point.record]);
                });
            }
            return chart;
        },
        lineChart:function (view) {
            var chart;
            chart = nv.models.lineChart().useInteractiveGuideline(true);
            view.setAxis('all', chart);
            return chart;
        },
        lineWithFocusChart:function (view) {
            var chart;
            chart = nv.models.lineWithFocusChart();
            view.setAxis(view.options.state.axisTitlePresent || 'all', chart);
            var actions = view.getActionsForEvent('selection');
            if (actions.length > 0)
            {
                chart.lines.dispatch.on('elementClick', function (e) {
                    view.doActions(actions, [e.point.record]);
                });
            }
            var actionsH = view.getActionsForEvent('hover');
            if (actionsH.length > 0)
            {
                chart.lines.dispatch.on('elementMouseover', function (e) {
                    view.doActions(actionsH, [e.point.record]);
                });
            }
            return chart;
        },
        stackedAreaChart:function (view) {
            var chart;
            chart = nv.models.stackedAreaChart().useInteractiveGuideline(true);
            view.setAxis('all', chart);
            return chart;
        },
        linePlusBarWithFocusChart: function (view) {
            var chart;
            chart = nv.models.linePlusBarWithFocusChart();
            return chart;
        },
        multiBarHorizontalChart:function (view) {
            var chart;
            chart = nv.models.multiBarHorizontalChart();
           // view.setAxis('all', chart);
            return chart;
        },
        scatterChart:function (view) {
            var chart;
            chart = nv.models.scatterChart();
            chart.showDistX(true)
                .showDistY(true)
                .scatter
                .onlyCircles(false);
            view.setAxis('all', chart);
            return chart;
        },
        discreteBarChart:function (view) {
            var chart;
            chart = nv.models.discreteBarChart();
            view.setAxis('all', chart);
            view.setOptions(chart);
            return chart;
        },
        pieChart:function (view) {
            var chart;

            chart = nv.models.pieChart()
                .showLabels(true)
                .labelType('percent');

            var options = {
                showControls: true,
                showLegend: true,
                showLabels: false,
            }
            return chart;
        }
    },
    getGraphModel: function(self, graphType) {
        var graphTypesMap = {
            multiBarChart: self.chart.multibar,
            multiBarHorizontalChart: self.chart.multibar,
            lineChart: self.chart.lines,
            lineWithFocusChart: self.chart.lines,
            linePlusBarChart: self.chart.lines,
            bulletChart: self.chart.bullet,
            scatterChart: self.chart.scatter,
            stackedAreaChart: self.chart.stacked,
            pieChart: self.chart.pie,
            discreteBarChart: self.chart.discretebar
        };
        return graphTypesMap[graphType];
    },
    doActions:function (actions, records) {
        _.each(actions, function (d) {
            d.action.doAction(records, d.mapping);
        });
    },
    getFieldLabel: function(field){
        var self = this;
        var fieldLabel = field.get('label');
        if (field.get('is_partitioned'))
            fieldLabel = field.get('partitionValue');

        if (!_.isUndefined(self.state.get('fieldLabels')) && !_.isNull(self.state.get('fieldLabels'))) {
            var fieldLabel_alternateObj = _.find(self.state.get('fieldLabels'), function (fl) {
                return fl.id == fieldLabel
            });
            if (!_.isUndefined(fieldLabel_alternateObj) && !_.isNull(fieldLabel_alternateObj))
                fieldLabel = fieldLabel_alternateObj.label;
        }
        return fieldLabel;
    },
});

})(jQuery, recline.View);
