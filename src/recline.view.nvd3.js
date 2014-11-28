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
        self.initialOptions = _.clone(this.options.state.options);
        // TODO:this validation should be triggered everytime model changes.
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
            if (typeof options[field] === 'undefined' || options[field] === '') {
            }
        });
    },
    render:function () {
        var self = this;

        var tmplData = this.model.toTemplateJSON();
        tmplData.viewId = this.uid;

        if (this.state.get('width'))
            tmplData.width = this.state.get('width');

        if (this.state.get('height'))
            tmplData.height = this.state.get('height');

        var htmls = Mustache.render(this.template, tmplData);
        $(this.el).html(htmls);
        this.$graph = this.el.find('.panel.nvd3graph_' + tmplData.viewId);
        self.trigger('chart:endDrawing');

        var records = this.model.records.models;

        var graphType = self.state.get('graphType');
        self.data = this.createSeries(graphType, records);

        nv.addGraph(function() {
            self.chart = self.createGraph(self);
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
    createSeries: function(graphType, records) {
        var self = this;
        var results = [];
        var seriesFields;
        self.chartMap = null;
        var xfield = self.state.get('xfield').toLowerCase();
        switch(graphType) {
            // These can be correctly grouped.
            case 'multiBarChart':
            case 'multiBarWithBrushChart':
            case 'multiBarHorizontalChart':
                seriesFields = self.state.get('seriesFields');
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
                seriesFields = self.state.get('seriesFields');
                var initResults = {};
                var groupResults = [];
                 _.each(seriesFields, function(field) {
                    var xCount = 0;
                    _.each(records, function(record) {
                        if (_.isUndefined(initResults[field])) {
                            initResults[field] = [];
                        }
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
    setOptions:function (chart, options) {
        var self = this;
        for(optionName in options){
            var optionValue = options[optionName];
            if(typeof optionValue === 'object'){
                self.setOptions(chart[optionName], optionValue);
            // if value is a valid function in the chart then we call it.
            } else if(chart && _.isFunction(chart[optionName])){
                chart[optionName](optionValue);
            }
        }
    },
    createGraph: function(view){
        var self = this;
        var graphType = self.state.get('graphType');
        var chart = nv.models[graphType]();
        var defaults = _.clone(view.getDefaults()[graphType]);
        //merge initial options with defaults
        defaults = _.extend(defaults || {}, self.initialOptions, self.state.get('options'));
        self.state.set('options', defaults);
        view.setOptions(chart,self.state.get('options'));
        return chart;
    },
    getDefaults: function(){
        var self = this;
        var defaults = {
            multiBarChart: {
                reduceXTicks: false,
            },
            lineChart:{
                useInteractiveGuideline: true,
                xAxis:{
                    tickFormat: function(id) {
                        return (self.chartMap) ? self.chartMap.get(id) : id;
                    }
                }
            },
            lineWithFocusChart:{
                xAxis:{
                    tickFormat: function(id) {
                        return (self.chartMap) ? self.chartMap.get(id) : id;
                    }
                }
            },
            stackedAreaChart: {
                useInteractiveGuideline: true,
                xAxis:{
                    tickFormat: function(id) {
                        return (self.chartMap) ? self.chartMap.get(id) : id;
                    }
                }
            },
            scatterChart: {
                showDistX: true,
                showDistY: true,
                onlyCircles: false,
                xAxis:{
                    tickFormat: function(id) {
                        return (self.chartMap) ? self.chartMap.get(id) : id;
                    }
                }
            },
            pieChart: {
                showLabels: true,
                labelType: 'percent'
            },
        };
        return defaults;
    }
});

})(jQuery, recline.View);
//dont remove. could be used later.
function merge(obj1, obj2) {
  for (var p in obj2) {
    try {
      if ( obj2[p].constructor==Object ) {
        obj1[p] = merge(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch(e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}
