/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};
this.recline.View.nvd3 = this.recline.View.nvd3 || {};

;(function ($, my) {
  'use strict';

  var DEFAULT_CHART_WIDTH = 640;
  var DEFAULT_CHART_HEIGHT = 480;

  function makeId(prefix) {
      prefix = prefix || '';
      return prefix + (Math.random() * 1e16).toFixed(0);
  }

  my.Base = Backbone.View.extend({
      template:'<div class="recline-graph">' +
        '{{data}}' +
          '<div class="panel {{viewId}}"style="display: block;">' +
            '<div id="{{viewId}}">' +
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                'width="{{width}}" height="{{height}}">' +
                '</svg></div>' +
          '</div>' +
        '</div> ',
      initialize: function(options) {
        var self = this;
        self.$el = $(self.el);
        _.extend(self, options);
        _.bindAll(this, 'render');

        var stateData = _.extend({},
          options.state
        );

        self.initialOptions = _.clone(this.options.state.options);
        self.graphType = self.graphType || 'multiBarChart';
        self.uuid = makeId('nvd3chart_');
        self.state = new recline.Model.ObjectState(stateData);
      },
      render: function(options){
        var self = this;
        var tmplData;
        var htmls;
        tmplData = self.model.toTemplateJSON();
        tmplData.viewId = self.uuid;

        tmplData.width = self.state.get('width') || DEFAULT_CHART_WIDTH;
        tmplData.height = self.state.get('height') || DEFAULT_CHART_HEIGHT;

        htmls = Mustache.render(self.template, tmplData);
        self.$el.html(htmls);
        self.$graph = self.$el.find('.panel.' + tmplData.viewId);
        self.trigger('chart:endDrawing');
        self.series = self.createSeries(self.model.records);
        nv.addGraph(function() {
          self.chart = self.createGraph(self.graphType);
          self.chart.height(self.state.get('height') || DEFAULT_CHART_HEIGHT);
          self.chart.width(self.state.get('width') || DEFAULT_CHART_WIDTH);
          d3.select('#' + self.uuid + ' svg')
            .datum(self.series)
            .transition()
            .duration(500)
            .call(self.chart);
          nv.utils.windowResize(self.chart.update);
          return self.chart;
        });

        return self;
      },
      createSeries: function(records){
        var self = this;
        records = records.toJSON();
        return _.map(self.state.get('seriesFields'), function(serie){
          var data = {};
          data.key = serie;
          data.values = _.map(records, function(record){
            return {y: self.y(record, serie), x: self.x(record)};
          });

          return data;
        });
      },
      setOptions: function (chart, options) {
        var self = this;
        for(var optionName in options){
          var optionValue = options[optionName];
          if(typeof optionValue === 'object'){
            self.setOptions(chart[optionName], optionValue);
          // if value is a valid function in the chart then we call it.
          } else if(chart && _.isFunction(chart[optionName])){
            chart[optionName](optionValue);
          }
        }
      },
      createGraph: function(graphType){
        var self = this;
        var chart = nv.models[graphType]();
        var defaults = _.clone(self.getDefaults());
        //merge initial options with defaults
        defaults = _.extend(defaults || {},
          self.initialOptions, self.state.get('options'));
        self.state.set('options', defaults);
        self.setOptions(chart, self.state.get('options'));
        return chart;
      },
      getDefaults: function(){
        return {};
      },
      setState: function(state){
        var self = this;
        self.state.set(state);
      },
      getState: function(state){
        return self.state.attributes;
      }
  });

})(jQuery, recline.View.nvd3);