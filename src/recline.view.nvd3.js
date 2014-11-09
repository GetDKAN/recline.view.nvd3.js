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
    my.NVD3Graph = Backbone.View.extend({

        template:'<div class="recline-graph"> \
      <div class="panel nvd3graph_{{viewId}}"style="display: block;"> \
        <div id="nvd3chart_{{viewId}}"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="bstrap" width="{{width}}" height="{{height}}"> \
        	  <defs> \
		    	<marker id = "Circle" viewBox = "0 0 40 40" refX = "12" refY = "12" markerWidth = "6" markerHeight = "6" stroke = "white" stroke-width = "4" fill = "dodgerblue" orient = "auto"> \
		    	<circle cx = "12" cy = "12" r = "12"/> \
		    	</marker> \
		      </defs> \
        	</svg></div>\
      </div> \
    </div> ',

        initialize:function (options) {
            var self = this;

            this.uid = options.id || ("" + new Date().getTime() + Math.floor(Math.random() * 10000)); // generating an unique id for the chart
            this.el = $(this.el);
            _.bindAll(this, 'render', 'redraw', 'graphResize', 'changeDimensions', 'getFormatter');


            this.model.bind('change', this.render);
            this.model.fields.bind('reset', this.render);
            this.model.fields.bind('add', this.render);

            this.model.records.bind('add', this.redraw);
            this.model.records.bind('reset', this.redraw);
            this.model.records.bind('remove', this.redraw);
            this.model.bind('query:done', this.redraw);
            this.model.queryState.bind('selection:done', this.redraw);
            this.model.bind('dimensions:change', this.changeDimensions);
			
			if (this.model.recordCount) { 
				this.render(); 
				this.redraw(); 
			}			

            if (this.options.state && this.options.state.loader)
            	this.options.state.loader.bindChart(this);
        },

        changeDimensions: function() {
            var self=this;
            self.state.attributes.group = self.model.getDimensions();
        },

        render:function () {
            var self = this;
            self.trigger("chart:startDrawing")
            var stateData = _.extend({
                    group:null,
                    seriesNameField:[],
                    seriesValues:[],
                    colors:["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"],
                    graphType:"lineChart",
                    xLabel:"",
                    id:0
                },
                this.options.state
            );
            this.state = new recline.Model.ObjectState(stateData);

            var tmplData = this.model.toTemplateJSON();
            tmplData["viewId"] = this.uid;
            if (this.state.attributes.width)
            	tmplData.width = this.state.attributes.width;

            if (this.state.attributes.height)
            	tmplData.height = this.state.attributes.height;

            delete this.chart;
            

                var htmls = Mustache.render(this.template, tmplData);
                $(this.el).html(htmls);
                this.$graph = this.el.find('.panel.nvd3graph_' + tmplData["viewId"]);
                self.trigger("chart:endDrawing")
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
                this.el.find('#nvd3chart_' + self.uid).width(width).height(height).html("").append(new recline.View.NoDataMsg().create());
                self.trigger("chart:endDrawing")
                return;
            }
            if ($("div.noData", this.el).length)
				self.render(); // remove previous noData frame
				
            var svgElem = this.el.find('#nvd3chart_' + self.uid+ ' svg') 
        	svgElem.css("display", "block")
        	// get computed dimensions
        	var width = svgElem.width()
        	var height = svgElem.height()

            var state = this.state;
            var seriesNVD3 = recline.Data.SeriesUtility.createSeries(this.state.attributes.series, 
            														this.state.attributes.unselectedColor, 
            														this.model, 
            														this.options.resultType, 
            														this.state.attributes.group, 
            														this.options.state.scaleTo100Perc, 
            														this.options.state.groupAllSmallSeries)
            														
        	var totalValues = 0;
            if (seriesNVD3)
        	{
            	_.each(seriesNVD3, function(s) {
            		if (s.values)
            			totalValues += s.values.length
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
			self.series = seriesNVD3;
            var graphType = this.state.get("graphType");

            var viewId = this.uid;

            var model = this.model;
            var state = this.state;
            var xLabel = this.state.get("xLabel");
            var yLabel = this.state.get("yLabel");

            nv.addGraph(function () {
                self.chart = self.getGraph[graphType](self);
                var svgElem = self.el.find('#nvd3chart_' + self.uid+ ' svg')
                var graphModel = self.getGraphModel(self, graphType)
                if (typeof graphModel == "undefined")
                	throw "NVD3 Graph type "+graphType+" not found!"
                
                if (self.options.state.options)
            	{
	                if (self.options.state.options.noTicksX)
	                    self.chart.xAxis.tickFormat(function (d) { return ''; });
	                else
	            	{
	                	var xField = self.model.fields.get(self.options.state.group)
	                	if (xField.attributes.type == "date")
						{
							if (graphType.indexOf("Horizontal") < 0 && self.options.state.tickFormatX)
							{
								self.chart.xAxis.tickFormat(function (d) {
									return self.options.state.tickFormatX(new Date(d)); 
								});
							}
							else if (graphType.indexOf("Horizontal") > 0 && self.options.state.tickFormatY)
							{
								self.chart.yAxis.tickFormat(function (d) {
									return self.options.state.tickFormatY(new Date(d)); 
								});
							}
							else 
	                		{
								self.chart.xAxis.tickFormat(function (d) {
									return d3.time.format("%d-%b")(new Date(d)); 
								});
							}
						}
	            	}
	                if (self.options.state.options.noTicksY)
	                    self.chart.yAxis.tickFormat(function (d) { return ''; });                	
	                if (self.options.state.options.customTooltips)
	            	{
	                	var leftOffset = 10;
	                	var topOffset = 0;
	                    //console.log("Replacing original tooltips")
	                    
	                    var xfield = self.model.fields.get(self.state.attributes.group);
	                    var yfield = self.model.fields.get(self.state.attributes.series);
	                    
	                    graphModel.dispatch.on('elementMouseover.tooltip', function(e) {
	                    	var pos;
	                    	if (e.e && e.e.pageY && e.e.pageX)
	                    		pos = {top: e.e.pageY, left: e.e.pageX}
	                    	else pos = {left: e.pos[0] + +svgElem.offset().left + 50, top: e.pos[1]+svgElem.offset().top}
	                    	
	                        var values;
	                    	if (graphType.indexOf("Horizontal") >= 0)
	                		{
	                        	values = { 
	                            		x: e.point.x,
	                            		y: (yfield ? self.getFormatter(yfield.get('type'))(e.point.y) : e.point.y),
	                            		y_orig: e.point.y_orig || e.point.y,
	                    				yLabel: e.series.key,
	                    				xLabel: (xfield ? xfield.get("label") : "") 
	                    			}
	                		}
	                    	else
	                		{
	                        	values = { 
	                            		x: (xfield ? self.getFormatter(xfield.get('type'))(e.point.x) : e.point.x),
	                            		y: e.point.y,
	                            		y_orig: e.point.y_orig || e.point.y,
	                    				xLabel: e.series.key,
	                    				yLabel: (yfield ? yfield.get("label") : "")
	                    			}
	                		}
	                    	values["record"] = e.point.record.attributes;
	                    		
	                        var content = Mustache.render(self.options.state.options.customTooltips, values);
	
	                        nv.tooltip.show([pos.left+leftOffset, pos.top+topOffset], content, (pos.left < self.el[0].offsetLeft + self.el.width()/2 ? 'w' : 'e'), null, self.el[0]);
	                      });
	                    
	                    graphModel.dispatch.on('elementMouseout.tooltip', function(e) {
	                    	nv.tooltip.cleanup();
	                    });
	            	}
            	}
                if (self.state.attributes.options) {
                    _.each(_.keys(self.state.attributes.options), function (d) {
                        try {
                            self.addOption[d](self.chart, self.state.attributes.options[d]);
                        }
                        catch (err) {
                            console.log("view.nvd3.graph.js: cannot add options " + d + " for graph type " + graphType)
                        }
                    });
                }
                ;

                d3.select('#nvd3chart_' + self.uid + '  svg')
                    .datum(seriesNVD3)
                    .transition()
                    .duration(self.options.state.timing || 500)
                    .call(self.chart);

                nv.utils.windowResize(self.graphResize);
                self.trigger("chart:endDrawing")

                //self.graphResize()
                return  self.chart;
            });
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
                    chart = nv.models.pieChart();

                chart.values(function(d) {
                    var ret=[];
                    _.each(d.values, function(dd) {
                        ret.push({x: dd.x, y:dd.y});
                    });
                    return ret;
                });
            	var actions = view.getActionsForEvent("selection");
                if (actions.length > 0)
            	{
                    chart.pie.dispatch.on('elementClick', function (e) {
                    	view.doActions(actions, [e.point.record]);
                    });
            	}
            	var actionsH = view.getActionsForEvent("hover");
                if (actionsH.length > 0)
            	{
                    chart.pie.dispatch.on('elementMouseover', function (e) {
                    	view.doActions(actionsH, [e.point.record]);
                    });
            	}

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

