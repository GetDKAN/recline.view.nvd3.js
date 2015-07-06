/*jshint multistr:true */
 /*jshint -W030 */
this.recline = this.recline || {};
this.recline.View = this.recline.View || {};
this.recline.View.nvd3 = this.recline.View.nvd3 || {};

;(function ($, my) {
  'use strict';

  function templateFunc(tpl){
     return function(key, y, e, graph){
       return _.template(tpl)({key: key, y: y, e: e, graph: graph});
     };
  }

  function makeId(prefix) {
      prefix = prefix || '';
      return prefix + (Math.random() * 1e16).toFixed(0);
  }

  function getFormatter(token){
    var format = _.last(token.split('::'));
    var type = _.first(token.split('::'));
    var formatter = {
      'String': _.identity,
      'Date': _.compose(d3.time.format(format || '%x'),_.instantiate(Date)),
      'Number': d3.format(format || '.02f')
    };
    return formatter[type];
  }

  var DEFAULT_CHART_WIDTH = 640;
  var DEFAULT_CHART_HEIGHT = 480;
  var MAX_ROW_NUM = 1000;
  var keyWrapMap = {
    tickFormat: getFormatter,
    valueFormat: getFormatter,
    average: _.iteratee,
    x: _.iteratee,
    y: _.iteratee,
    ranges: _.iteratee,
    markers: _.iteratee,
    measures: _.iteratee,
    rangeLabels: _.iteratee,
    markerLabels: _.iteratee,
    measureLabels: _.iteratee,
    tooltipContent: templateFunc,
    pointSize: _.iteratee
  };

  my.Base = Backbone.View.extend({
      template:'<div class="recline-graph row">' +
                  '{{data}}' +
                  '<div class="{{columnClass}} {{viewId}}"style="display: block;">' +
                    '<div id="{{viewId}}">' +
                        '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                        ' height="{{height}}" width="{{width}}">' +
                        '</svg>' +
                    '</div>' +
                  '</div>' +
                '</div> ',
      initialize: function(options) {
        var self = this;
        self.$el = $(self.el);

        self.graphType = self.graphType || 'multiBarChart';
        self.uuid = makeId('nvd3chart_');
        self.state = options.state;
        self.xfield = self.state.get('options').x;
        self.series = self.getSeries();
        self.xDataType = self.state.get('xDataType');
        self.chartMap = d3.map();
        self.state.listenTo(self.state, 'change', _.bind(self.render, self));
      },
      getLayoutParams: function(){
        var self = this;
        var layout = {
          columnClass: 'col-md-12',
          width: self.state.get('width') || self.$el.innerWidth() || DEFAULT_CHART_WIDTH,
          height: self.state.get('height') || DEFAULT_CHART_HEIGHT
        };
        return layout;
      },
      render: function(){
        var self = this;
        var tmplData;
        var htmls;
        var layout;

        layout = self.getLayoutParams();
        tmplData = self.model.toTemplateJSON();
        tmplData.viewId = self.uuid;

        _.extend(tmplData, layout);

        htmls = Mustache.render(self.template, tmplData);
        self.$el.html(htmls);
        self.$graph = self.$el.find('.panel.' + tmplData.viewId);
        self.trigger('chart:endDrawing');

        // Infering x value type
        var computeXLabels = self.needForceX(self.model.records, self.graphType);
        self.state.set('computeXLabels', computeXLabels, {silent:true});

        // If number of rows is too big then try to group by x.
        self.state.set('group', self.model.records.length > MAX_ROW_NUM || self.state.get('group', {silent:true}));


        self.series = self.createSeries(self.model.records);
        nv.addGraph(function() {
          self.chart = self.createGraph(self.graphType);

          /**
           * Configure all not configured formats with
           * taking care of the axis data type.
           */
          self.configureDefaultFormats(self.chart, self.state.get('options'));

          // Give a chance to alter the chart before it is rendered.
          self.alterChart && self.alterChart(self.chart);

          d3.select('#' + self.uuid + ' svg')
            .datum(self.series)
            .transition()
            .duration(self.state.get('transitionTime') || 500)
            .call(self.chart);

          // Hack to reduce ticks even if the chart has not that option.
          if(self.graphType === 'discreteBarChart' && self.state.get('options') && self.state.get('options').reduceXTicks){
            self.reduceXTicks();
          }

          nv.utils.windowResize(self.updateChart.bind(self));
          return self.chart;
        });
        return self;
      },
      updateChart: function(){
        var self = this;
        d3.select('#' + self.uuid + ' svg')
          .transition()
          .duration(self.state.get('transitionTime') || 500)
          .call(self.chart);
      },
      reduceXTicks: function(){
        var self = this;
        var layout = self.getLayoutParams(self.state.get('mode'));
        d3.select('.nv-x.nv-axis > g').selectAll('g')
          .filter(function(d, i) {
              return i % Math.ceil(self.model.records.length / (layout.width / 100)) !== 0;
          })
          .selectAll('text, line')
          .style('opacity', 0);
      },
      createSeries: function(records){
        var self = this;
        var series;

        // Return no data when x or y are no set.
        if(!self.xfield || !self.getSeries()) return [];

        records = records.toJSON();

        series = _.map(self.getSeries(), function(serie){
          var data = {};
          data.key = serie;

          // Group by xfield and acum all the series fields.
          records = (self.state.get('group'))?
            _.reportBy(records, self.xfield, self.series)
            : records;

          // Sorting
          records = _.sortBy(records, self.getSort(self.state.get('sort')));
          data.values = _.map(records, function(record, index){
            var rc = {};

            if(self.state.get('computeXLabels')){
              self.chartMap.set(index, record[self.xfield]);
              rc.label = rc[self.xfield];
              rc[self.xfield] = index;
            } else {
              rc[self.xfield] = _.cast(record[self.xfield], self.xDataType);
            }
            rc.y = _.cast(record[serie], _.inferType(record[serie]));
            return _.defaults(rc, record);
          });
          return data;
        });
        return series;
      },
      getSort: function(sort){
        if(!sort || sort === 'default') return _.identity;
        return sort;
      },
      needForceX: function(records, graphType){
       var self = this;
       var xfield = self.xfield;
       records = records.toJSON();
       return _.some(records, function(record){
         return _.inferType(record[xfield]) === 'String';
       }) &&
       graphType !== 'discreteBarChart' &&
       graphType !== 'multiBarChart' &&
       graphType !== 'multiBarHorizontalChart';
      },
      createGraph: function(graphType){
        var self = this;
        var chart = nv.models[graphType]();

        // Set each graph option recursively.
        self.configure(self.state, chart);
        return chart;
      },
      getSeries: function(){
        var self = this;
        return self.state.get('seriesFields');
      },
      wrapValue: function(key, value, keyWrapMap) {

        // it's already a function then return.
        if(_.isFunction(value)) return value;

        // it's not a function but needs to be.
        if(key in keyWrapMap) return keyWrapMap[key](value);

        // it's not a function but does not needs to be.
        return value;
      },
      prepareOptions: function(options){
        var self = this;
        return _.reduce(options, function(result, value, key){
          result[key] = self.wrapValue(key, value, keyWrapMap);
          return result;
        }, {});
      },
      configure: function(state, chart){
        var self = this;
        var options = state.get('options');
        var axesNames = self.getAxesNames(options);
        var axesOpts = _.pick(options, axesNames);
        var margins = _.first(_.values(_.pick(options, 'margin')));
        var chartOpts = _.omit(options,_.union(axesNames, ['margin']));

        // Configure charts.
        self.configureChart(chart, self.prepareOptions(chartOpts));

        // Configure axes.
        _.each(_.keys(axesOpts), function(axisName){
          self.configureAxis(chart, self.prepareOptions(axesOpts[axisName], axisName), axisName);
        });

        // Configure margins
        self.configureMargins(chart, margins);
      },
      getAxesNames: function(chartOrOptions){
        var axisNames = ['xAxis', 'x2Axis', 'y1Axis', 'y2Axis',
          'y3Axis', 'y4Axis', 'yAxis', 'yAxis1', 'yAxis2'
        ];
        return _.filter(_.keys(chartOrOptions), function(value){
          return _.contains(axisNames, value);
        });
      },
      getNotFormattedAxes: function(chart, options){
        var self = this;
        var chartAxes = self.getAxesNames(chart);
        return _.filter(chartAxes,
          _.negate(_.partial(self.hasFormat, options))
        );
      },
      hasFormat: function(options, axisName){
        return !!options[axisName] && !!options[axisName].tickFormat;
      },
      configureDefaultFormats: function(chart, options){
        var self = this;

        // Loop over all not set tickFormats
        _.each(self.getNotFormattedAxes(chart, options), function(axisName){

          var axis = chart[axisName];
          var accesor = axisName.charAt(0);
          var records = self.model.records.toJSON();
          var xAsLabels = self.state.get('computeXLabels');

          // Set default accesors
          if(accesor === 'y'){
            accesor = _.iteratee(_.first(self.state.get('seriesFields')));
          } else if(accesor === 'x') {
            accesor = _.iteratee(self.xfield);
          }

          // Override accesors with options
          if(_.isFunction(options[accesor])){
            accesor = options[accesor];
          } else if(_.isString(options[accesor])){
            accesor = _.iteratee(options[accesor]);
          }

          var sampleValue = accesor(_.first(records));
          var type = _.inferType(sampleValue);

          axis.tickFormat(self.getFormatByType(type, xAsLabels));
        });
      },
      getFormatByType: function(type, xAsLabels){
        var self = this;

        if(xAsLabels) return self.chartMap.get.bind(self.chartMap);

        var format = {
          'String': _.identity,
          'Date': _.compose(d3.time.format('%x'), _.instantiate(Date)),
          'Number': d3.format('.02f')
        };
        return format[type];
      },
      configureChart: function(chart, chartOpts){
        chart.options(chartOpts);
      },
      configureAxis: function(chart, axisOpt, axisName){
        if(_.has(chart, axisName)){
          chart[axisName].options(axisOpt);
        }
      },
      configureMargins: function(chart, margins){
        if(margins) chart.margin(margins);
      }
  });

})(jQuery, this.recline.View.nvd3);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
'use strict';

  my.cumulativeLineChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'cumulativeLineChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        useInteractiveGuideline: true,
        tooltips: true
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
'use strict';

  my.discreteBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'discreteBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        computeXLabels: false,
        options:{
          tooltips: true
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.lineChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'lineChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      var self = this;
      return {
        options: {
          useInteractiveGuideline: true,
          tooltips: true,
          xAxis:{
            tickFormat: function(id) {
              return (self.chartMap) ? self.chartMap.get(id) : id;
            }
          }
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.lineWithFocusChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'lineWithFocusChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      var self = this;
      return {
        options: {
          tooltips: true,
          xAxis:{
            tickFormat: function(id) {
              return (self.chartMap) ? self.chartMap.get(id) : id;
            }
          }
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.multiBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});

    },
    getDefaults: function(){
      return {
        computeXLabels: false,
        options:{
          reduceXTicks: true,
          tooltips: true
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.multiBarHorizontalChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarHorizontalChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', false);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        options: {
          tooltips: true,
          reduceXTicks: false,
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.pieChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'pieChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    alterChart: function(chart){
      var self = this;

      // we don't want labels to fill all the canvas.
      if(self.series.length > 10){
        chart.showLegend(false);
      }
    },
    createSeries: function(records){
      var self = this;
      records = records.toJSON();
      var serie = _.first(self.state.get('seriesFields'));
      // Group by xfield and acum all the series fields.
      records = (self.state.get('group'))?
        _.reportBy(records, self.state.get('xfield'), self.state.get('seriesFields'))
        : records;
      return  _.map(records, function(record){
        return {y: self.y(record, serie), x: self.x(record, self.state.get('xfield'))};
      });
    },
    getDefaults: function(){
      return {
        options: {
          showLabels: true,
          labelType: 'percent',
          tooltips:true
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.scatterChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'scatterChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      var self = this;
      return {
        options: {
          showDistX: true,
          showDistY: true,
          onlyCircles: false,
          xAxis:{
            tickFormat: function(id) {
              return (self.chartMap) ? self.chartMap.get(id) : id;
            }
          }
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.stackedAreaChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'stackedAreaChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        options:{
          useInteractiveGuideline: true,
          tooltips: true,
          xAxis:{
            tickFormat: function(d) {
              return d3.time.format('%Y')(new Date(d));
            }
          }
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
;jQuery(function(){
	'use strict';
	_.mixin({
	  getFields: function(model){
	    var fields = [];
	    try{
	      fields = _.pluck(model.fields.toJSON(), 'id');
	    } catch(err) {
	      console.error('Error retrieving dataset fields');
	    }
	    return fields;
	  },
		applyOption:function(options, selected){
			return _.map(options, function(option){
				option.selected = (_.inArray(selected, option.value))? true : false;
				return option;
			});
		},
		arrayToOptions: function(options){
			return _.map(options, function(option){
				return {name:option, value:option, selected: false};
			});
		},
	});
});
