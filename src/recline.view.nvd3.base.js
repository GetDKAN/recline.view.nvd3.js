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
      template:'<div class="recline-graph row">' +
        '{{data}}' +
          '<div class="{{columnClass}} {{viewId}}"style="display: block;">' +
            '<div id="{{viewId}}">' +
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' +
                'width="{{width}}" height="{{height}}">' +
                '</svg></div>' +
            '<div id="grid"></div>' +
          '</div>' +
          '<div class="col-md-5 recline-graph-controls {{controlVisibility}}"></div>' +
        '</div> ',
      initialize: function(options) {
        var self = this;

        self.$el = $(self.el);
        _.extend(self, options);
        _.bindAll(this, 'render');

        var stateData = _.extend({
            width: 640,
            height: 480,
            group: false,
          },
          options.state
        );

        self.graphType = self.graphType || 'multiBarChart';
        self.uuid = makeId('nvd3chart_');
        self.state = new recline.Model.ObjectState(stateData);
        self.chartMap = d3.map();

        // Check current view mode: edit or widget.
        if(options.mode) self.state.set('mode', options.mode);
      },
      getLayoutParams: function(mode){
        var self = this;
        var layout;

        if(mode === 'widget'){
         layout = {
            columnClass: 'col-md-12',
            width: self.$el.parent().width(),
            height: $(window).height(),
            controlVisibility: 'hidden'
          };
        } else {
         layout = {
            columnClass: 'col-md-7',
            width: self.state.get('width') || DEFAULT_CHART_WIDTH,
            height: self.state.get('height') || DEFAULT_CHART_HEIGHT,
            controlVisibility:''
          };
        }
        return layout;
      },
      render: function(options){
        var self = this;
        var tmplData;
        var htmls;
        var layout;

        layout = self.getLayoutParams(self.state.get('mode'));
        tmplData = self.model.toTemplateJSON();
        tmplData.viewId = self.uuid;

        _.extend(tmplData, layout);

        htmls = Mustache.render(self.template, tmplData);
        self.$el.html(htmls);
        self.$graph = self.$el.find('.panel.' + tmplData.viewId);
        self.trigger('chart:endDrawing');
        self.series = self.createSeries(self.model.records);
        nv.addGraph(function() {
          self.chart = self.createGraph(self.graphType);
          self.chart.height(layout.height);
          self.chart.width(layout.width);

          if(self.chart.xAxis && self.chart.xAxis.tickFormat)
            self.chart.xAxis.tickFormat(self.xFormatter);
          if(self.chart.x2Axis)
            self.chart.x2Axis.tickFormat(self.xFormatter);

          d3.select('#' + self.uuid + ' svg')
            .datum(self.series)
            .transition()
            .duration(self.state.get('transitionTime') || 500)
            .call(self.chart);
          nv.utils.windowResize(self.chart.update);
          return self.chart;
        });
        self.$('.recline-graph-controls').append(self.menu.$el);
        self.menu.setElement(self.$('.recline-graph-controls')).render();
        return self;
      },
      createSeries: function(records){
        var self = this;
        var series;
        var fieldType;
        var xDataType;
        // Return no data when x and y are no set.
        if(!self.state.get('xfield') || !self.getSeries().length) return [];

        records = records.toJSON();

        fieldType = _.compose(_.inferType,_.iteratee(self.state.get('xfield')));

        if(!self.state.get('xDataType') || self.state.get('xDataType') === 'Auto'){
          xDataType =  fieldType(_.last(records));
        } else {
          xDataType = self.state.get('xDataType');
        }

        self.xFormatter = self.getFormatter(xDataType, self.state.get('xFormat'));

        series = _.map(self.getSeries(), function(serie){
          var data = {};
          data.key = serie;

          // Group by xfield and acum all the series fields.
          records = (self.state.get('group'))?
            _.reportBy(records, self.state.get('xfield'), self.state.get('seriesFields'))
            : records;

          data.values = _.map(records, function(record, index){
            if(self.state.get('computeXLabels')){
              self.chartMap.set(index, self.x(record, self.state.get('xfield')));
              return {y: self.y(record, serie), x: index, label: self.x(record, self.state.get('xfield'))};
            } else {
              return {
                y: self.y(record, serie),
                x: _.cast(self.x(record, self.state.get('xfield')), xDataType)
              };
            }
          });
          return data;
        });
        return series;
      },
      isXTypeAllowed: function(){
        /* IMPLEMENT */
      },
      getFormatter: function(type, format){
        var self = this;
        if(self.state.get('computeXLabels')) return self.chartMap.get.bind(self.chartMap);

        var formatter = {
          'String': _.identity,
          'Date': _.compose(d3.time.format(format || '%x'),_.instantiate(Date)),
          'Number': d3.format(format || '.02f')
        };
        return formatter[type];
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

        // Set each graph option recursively.
        self.setOptions(chart, self.state.get('options'));
        return chart;
      },
      getDefaults: function(){
        return {};
      },
      setSavedState: function(state){
        var self = this;
        var defaults = self.getDefaults();

        state = state || {};
        state = _.deepMerge(state, defaults);
        self.state.set(state);
      },
      getState: function(state){
        var self = this;
        return self.state.attributes;
      },
      getSeries: function(){
        var self = this;
        return self.state.get('seriesFields');
      },
      x: function(record, xfield){
        return record[xfield];
      },
      y: function(record, serie){
        return record[serie];
      }
  });

})(jQuery, recline.View.nvd3);