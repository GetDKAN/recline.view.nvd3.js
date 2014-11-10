/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

// ## Linegraph view for a Dataset using nvd3 graphing library.
//
// Initialization arguments (in a hash in first parameter):
//
// * model: recline.Model.Dataset
// * state: (optional) configuration hash of form:
//
//        { 
//          group: {column name for x-axis},
//          series: [{column name for series A}, {column name series B}, ... ],
//          colors: ["#edc240", "#afd8f8", ...]
//        }
//
// NB: should *not* provide an el argument to the view but must let the view
// generate the element itself (you can then append view.el to the DOM.
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

        this.uid = options.id || ("" + new Date().getTime() + Math.floor(Math.random() * 10000)); // generating an unique id for the chart
        this.el = $(this.el);
         _.bindAll(this, 'render', 'redraw');

              // this.state.options.xfield
            // this.state.options.yfield
            // this.state.options.seriesFields
      
        var stateData = _.extend({
                group:null,
                seriesNameField:[],
                seriesValues:[],
                colors:["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                graphType: "pieChart",
                xLabel:"",
                yLabel:"",
                xfield: "",
                yfield: "", 
                id:0
            },
            this.options.state
        );
        this.state = new recline.Model.ObjectState(stateData);

    },

    render:function () {
        console.log('render');
        var self = this;

        var tmplData = this.model.toTemplateJSON();
        tmplData["viewId"] = this.uid;
        if (this.state.attributes.width)
            tmplData.width = this.state.attributes.width;

        if (this.state.attributes.height)
            tmplData.height = this.state.attributes.height;
    
        var htmls = Mustache.render(this.template, tmplData);
        $(this.el).html(htmls);
//            this.$graph = this.el.find('.panel.nvd3graph_' + tmplData["viewId"]);
        self.trigger("chart:endDrawing");

        var records = this.model.records.models;

        var data = this.createSeries(records);
        var graphType = self.state.attributes.graphType;
  
        nv.addGraph(function() {
        
            self.chart = self.getGraph[graphType](self);
            self.chart.height(self.state.attributes.height);
            self.chart.width(self.state.attributes.width);

            var svgElem = self.el.find('#nvd3chart_' + self.uid + ' svg')
            var graphModel = self.getGraphModel(self, graphType)
            if (typeof graphModel == "undefined")
                throw "NVD3 Graph type " + graphType + " not found!"

            d3.select("#nvd3chart_" + self.uid + " svg")
                .datum(data)
                .transition().duration(1200)
                .call(self.chart);
        }); 
       
        return this;
    },
        redraw:function () {
            console.log("redraw");
            var self = this;
            self.trigger("chart:startDrawing")

            if (typeof self.model.records == "undefined" || self.model.records == null || self.model.records.length == 0)
            {
                var svgElem = this.el.find('#nvd3chart_' + self.uid+ ' svg')
                svgElem.css("display", "block")
                // get computed dimensions
                var width = svgElem.width()
                var height = svgElem.height()

                // display noData message and exit
                svgElem.css("display", "none")
                this.el.find('#nvd3chart_' + self.uid).width(width).height(height).html("").append("no data");
                self.trigger("chart:endDrawing")
                return;
            }
            if ($("div.noData", this.el).length)
                self.render(); // remove previous noData frame

            console.log('sdddasdddddd');    
                
            var svgElem = this.el.find('#nvd3chart_' + self.uid+ ' svg') 
            svgElem.css("display", "block")
            // get computed dimensions
            var width = svgElem.width()
            var height = svgElem.height()

            var state = this.state;

            // this.state.options.xfield
            // this.state.options.yfield
            // this.state.options.seriesFields
            var results = [];
            var result = '';
            var xfield = "gender";
            var yfield = "y";
            // Create Series

            self.series =  results;
            console.log(results);
                            
            var totalValues = 0;
            if (results)
            {
                _.each(results, function(s) {
                    if (s.y)
                        totalValues++
                });
            }
            if (!totalValues)
            {
                // display noData message and exit
                svgElem.css("display", "none")
                this.el.find('#nvd3chart_' + self.uid).width(width).height(height).html("").append(new recline.View.NoDataMsg().create());
                self.trigger("chart:endDrawing")
                return null;
            }           
        },
    createSeries: function(records) {
        var self = this;
        var xfield = self.state.attributes.xfield.toLowerCase();
        var yfield = self.state.attributes.yfield.toLowerCase();

        var results = [];
        if (records) {
            _.each(records, function(record) {
                if (record.attributes[xfield] && record.attributes[yfield]) {
                    results.push({
                        x: record.attributes[xfield],
                        y: record.attributes[yfield]
                    });

                }
            });
        }
  
        if (self.state.attributes.group) {
            // Group has to group on the xfield.
            var groupField = 'x';
            var totalField = 'y';
            var groups = {};
            var grouped = [];
            results.forEach(function (o) {
                groups[o[groupField]] = groups[o[groupField]] || [];
                var total = groups[o[groupField]] || 0;
                groups[o[groupField]] = +total + +o[totalField];
            });
            _.each(groups, function (group, total) {
                grouped.push({
                    x: total,
                    y: group
                });
            });
            results = grouped;
        }
        return results;

    },

        graphResize:function () {
            var self = this;
            var viewId = this.uid;

            if (!self.$el.is(":visible"))
                return;         

            // this only works by previously setting the body height to a numeric pixel size (percentage size don't work)
            // so we assign the window height to the body height with the command below
            var container = self.el;
            while (!container.hasClass('container-fluid') && !container.hasClass('container') && container.length)
                container = container.parent();
            
            if (typeof container != "undefined" && container != null 
                    && (container.hasClass('container') || container.hasClass('container-fluid'))
                    && container[0].style && container[0].style.height
                    && container[0].style.height.indexOf("%") > 0) 
            {
                $("body").height($(window).innerHeight() - 10);
    
                var currAncestor = self.el;
                while (!currAncestor.hasClass('row-fluid') && !currAncestor.hasClass('row'))
                    currAncestor = currAncestor.parent();
    
                if (typeof currAncestor != "undefined" && currAncestor != null && (currAncestor.hasClass('row-fluid') || currAncestor.hasClass('row'))) {
                    var newH = currAncestor.height();
                    $('#nvd3chart_' + viewId).height(newH);
                    $('#nvd3chart_' + viewId + '  svg').height(newH);
                }
            }
            if (self.chart && self.chart.update)
                self.chart.update(); // calls original 'update' function
        },
        setAxis:function (axis, chart) {
            var self = this;

            var xLabel = self.state.get("xLabel");

            if (axis == "all" || axis == "x") {
                var xAxisFormat = function(str) {return str;}
                // axis are switched when using horizontal bar chart
                if (self.state.get("graphType").indexOf("Horizontal") < 0)
                {
                    var xfield = self.model.fields.get(self.state.attributes.group);
                    xAxisFormat = self.state.get("tickFormatX") || self.getFormatter(xfield.get('type'));
                    if (xLabel == null || xLabel == "" || typeof xLabel == 'undefined')
                        xLabel = xfield.get('label');
                }
                else
                {
                    xLabel = self.state.get("yLabel");
                    if (self.state.get("tickFormatY"))
                        xAxisFormat = self.state.get("tickFormatY");
                }

                // set data format
                chart.xAxis
                    .axisLabel(xLabel)
                    .tickFormat(xAxisFormat)

            } 
            if (axis == "all" || axis == "y") {
                var yLabel = self.state.get("yLabel");

                var yAxisFormat = function(str) {return str;}
                // axis are switched when using horizontal bar chart
                if (self.state.get("graphType").indexOf("Horizontal") >= 0)
                {
                    var yfield = self.model.fields.get(self.state.attributes.group);                
                    yAxisFormat = self.state.get("tickFormatX") || self.getFormatter(yfield.get('type'))
                    yLabel = self.state.get("xLabel");
                }
                else
                {
                    if (self.state.get("tickFormatY"))
                        yAxisFormat = self.state.get("tickFormatY");

                    if (yLabel == null || yLabel == "" || typeof yLabel == 'undefined')
                        yLabel = self.state.attributes.seriesValues.join("/");
                }
                    
                chart.yAxis
                    .axisLabel(yLabel)
                    .tickFormat(yAxisFormat);
            }
        },
        getFormatter: function(type) {
            var self = this;
            switch(type)
            {
            case "string": return d3.format(',s');
            case "float": return d3.format(',r');
            case "integer": return d3.format(',r');
            case "date": return d3.time.format('%x');
            }
        },
        addOption:{
            "staggerLabels":function (chart, value) {
                chart.staggerLabels(value);
            },
            "tooltips":function (chart, value) {
                chart.tooltips(value);
            },
            "showValues":function (chart, value) {
                chart.showValues(value);
            },
            "tooltip": function(chart, value) {
                var t = function(key, x, y, e, graph) {
                    return value.replace("{x}", x)
                        .replace("{y}", y)
                        .replace("{key}", key);
                };
                chart.tooltip(t);
            },
            "minmax":function (chart, value) {
            },
            "trendlines":function (chart, value) {
            },
            "showLegend":function(chart, value) {
                chart.showLegend(value);
            },
            "showControls":function(chart, value) {
                if (chart.showControls)
                    chart.showControls(value);
            },
            "showMaxMin":function(chart, value) {
                chart.showMaxMin(value);
            },
            showValues: function(chart, value) {
                chart.showValues(value);
            },
            "customTooltips":function (chart, value) { 
            },
            "stacked":function(chart, value) {
                chart.stacked(value);
            },
            "grouped":function(chart, value) {
                chart.stacked(!value);
            },
            "margin":function(chart, value) {
                chart.margin(value);
            },
        },
        getGraph:{
            "multiBarChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.multiBarChart();

                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                    chart.multibar.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.multibar.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }
                return chart;
            },
            "lineChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.lineChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.lines.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.lines.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }
                return chart;
            },
            "lineDottedChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.lineDottedChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.lines.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.lines.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }
                return chart;
            },
            "lineWithFocusChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.lineWithFocusChart();

                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.lines.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.lines.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }                return chart;
            },
            "indentedTree":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.indentedTree();
            },
            "stackedAreaChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.stackedAreaChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.stacked.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.stacked.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }
                return chart;
            },

            "historicalBar":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.historicalBar();
                return chart;
            },
            "multiBarHorizontalChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.multiBarHorizontalChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.multibar.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.multibar.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }
                return chart;
            },
            "legend":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.legend();
                return chart;
            },
            "line":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.line();
                return chart;
            },
            "sparkline":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.sparkline();
                return chart;
            },
            "sparklinePlus":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.sparklinePlus();
                return chart;
            },

            "multiChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.multiChart();
                return chart;
            },

            "bulletChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.bulletChart();
                return chart;
            },
            "linePlusBarChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.linePlusBarChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                return chart;
            },
            "cumulativeLineChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.cumulativeLineChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                return chart;
            },
            "scatterChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.scatterChart();
                chart.showDistX(true)
                    .showDistY(true);
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
                {
                    chart.scatter.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                }
                var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
                {
                    chart.scatter.dispatch.on('elementMouseover', function (e) {
                        view.doActions(actionsH, [e.point.record]);
                    });
                }                
                return chart;
            },
            "discreteBarChart":function (view) {
                var actions = view.getActionsForEvent("selection");
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.discreteBarChart();
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);

                if (actions.length > 0)
                    chart.discretebar.dispatch.on('elementClick', function (e) {
                        view.doActions(actions, [e.point.record]);
                    });
                return chart;
                var options = {};

                if (view.state.attributes.options) {
                    if (view.state.attributes.options("trendlines"))
                        options["trendlines"] = view.state.attributes.options("trendlines");
                    if (view.state.attributes.options("minmax"))
                        options["minmax"] = view.state.attributes.options("minmax");

                }


                if (actions.length > 0) {
                    options["callback"] = function (x) {

                        // selection is done on x axis so I need to take the record with range [min_x, max_x]
                        // is the group attribute
                        var record_min = _.min(x, function (d) {
                            return d.min.x
                        });
                        var record_max = _.max(x, function (d) {
                            return d.max.x
                        });
                        console.log("Filtering for ");
                        console.log(record_min);
                        console.log(record_max);
                        view.doActions(actions, [record_min.min.record, record_max.max.record]);

                    };
                } else
                    options["callback"] = function () {
                    };
            },
            "lineWithBrushChart":function (view) {


                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.lineWithBrushChart(options);
                view.setAxis(view.options.state.axisTitlePresent || "all", chart);
                return  chart
            },
            "multiBarWithBrushChart":function (view) {
                var actions = view.getActionsForEvent("selection");
                var options = {};

                if (view.state.attributes.options) {
                    if (view.state.attributes.options["trendlines"])
                        options["trendlines"] = view.state.attributes.options("trendlines");
                    if (view.state.attributes.options["minmax"])
                        options["minmax"] = view.state.attributes.options("minmax");

                }

                if (actions.length > 0) {
                    options["callback"] = function (x) {

                        // selection is done on x axis so I need to take the record with range [min_x, max_x]
                        // is the group attribute
                        /*var record_min = _.min(x, function (d) {
                            return d.min.x
                        });
                        var record_max = _.max(x, function (d) {
                            return d.max.x
                        });*/
                        var record_min = x[0][0].record;
                        var record_max = x[0][x[0].length-1].record;

                        view.doActions(actions, [record_min, record_max]);

                    };
                } else
                    options["callback"] = function () {
                    };

                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.multiBarWithBrushChart(options);

                return chart;
            },

            "pieChart":function (view) {
                var chart;
                if (view.chart != null)
                    chart = view.chart;
                else
                    chart = nv.models.pieChart()
                        .x(function(d) { return d.x })
                        .y(function(d) { return d.y })
                        .showLabels(true)
                        .labelType("percent");
                return chart;
            }

        },
        getGraphModel: function(self, graphType) {
            switch(graphType) {
                
            case "historicalBar":
            case "multiBarChart": 
            case "multiBarWithBrushChart":
            case "multiBarHorizontalChart":
                return self.chart.multibar;
            case "lineChart":
            case "lineDottedChart":
            case "lineWithFocusChart":
            case "linePlusBarChart":
            case "cumulativeLineChart":
            case "lineWithBrushChart":
                return self.chart.lines;
            case "bulletChart":
                return self.chart.bullet;
            case "scatterChart":
                return self.chart.scatter;
            case "stackedAreaChart":
                return self.chart.stacked;
            case "pieChart":
                return self.chart.pie;
            case "discreteBarChart":
                return self.chart.discretebar;
            }
        },
        doActions:function (actions, records) {

            _.each(actions, function (d) {
                d.action.doAction(records, d.mapping);
            });

        },
        getFieldLabel: function(field){
            var self=this;
            var fieldLabel = field.attributes.label;
            if (field.attributes.is_partitioned)
                fieldLabel = field.attributes.partitionValue;

            if (typeof self.state.attributes.fieldLabels != "undefined" && self.state.attributes.fieldLabels != null) {
                var fieldLabel_alternateObj = _.find(self.state.attributes.fieldLabels, function (fl) {
                    return fl.id == fieldLabel
                });
                if (typeof fieldLabel_alternateObj != "undefined" && fieldLabel_alternateObj != null)
                    fieldLabel = fieldLabel_alternateObj.label;
            }

            return fieldLabel;
        },
    });


})(jQuery, recline.View);

function groupBy(array, f) {
  var groups = [];
  var grouped = []
  array.forEach(function (o) {
    var group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    var total = groups[group] || 0;
    groups[group] = +total + +o.y;
  });
  groups.forEach(function (x,y) {
    grouped.push({
        x: x,
        y: y
    });
  });
  console.log(grouped);

  return grouped;
}
