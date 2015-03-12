;(function ($, my) {
  'use strict';


  my.ChooseChartView = Backbone.View.extend({
    template: '<div class="form-group">' +
                '<div class="form-group">' +
                  '<label>Source</label>' +
                  '<div>{{source.url}}</div>'+
                '</div>' +
                '<div class="form-group">' +
                  '<label>X Field</label>' +
                  '<div>{{xfield}}</div>'+
                '</div>' +
                '<div class="form-group">' +
                  '<label>Series fields</label>' +
                  '<div>{{seriesFields}}</div>'+
                '</div>' +
                '<ul id="chart-selector">' +
                  '{{#graphTypes}}' +
                    '<li class="{{value}} {{#selected}}selected{{/selected}}" data-selected="{{value}}"></li>' +
                  '{{/graphTypes}}' +
                '</ul>' +
              '</div>' +
              '<div id="controls">' +
                '<div id="prev" class="btn btn-default pull-left">Back</div>' +
                '<div id="next" class="btn btn-primary pull-right">Next</div>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.stepInfo = {
        title: 'Choose Chart',
        name: 'chooseChart'
      };
    },
    events: {
      'click #chart-selector li': 'selectChart'
    },
    selectChart: function(e){
      var self = this;
      self.$('li').removeClass('selected');
      self.$(e.target).addClass('selected');
    },
    getSelected: function(){
      var self = this;
      return self.$('li.selected').data('selected');
    },
    render: function(){
      var self = this;
      var graphTypes = ['discreteBarChart', 'multiBarChart', 'stackedAreaChart', 'pieChart',
        'lineChart', 'lineWithFocusChart', 'scatterChart', 'linePlusBarChart'
      ];

      self.state.set('graphTypes', _.applyOption(
        _.arrayToOptions(graphTypes), [self.state.get('graphType') || 'discreteBarChart']
      ));
      self.$el.html(Mustache.render(self.template, self.state.toJSON()));
      self.$('.chosen-select').chosen({width: '95%'});
    },
    updateState: function(state, cb){
      var self = this;
      var type = self.getSelected();
      state.set('graphType', type);
      cb(state);
    }
  });

})(jQuery, window);