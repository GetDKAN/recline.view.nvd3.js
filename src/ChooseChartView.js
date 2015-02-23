;(function ($, my) {
  'use strict';

  my.ChooseChartView = Backbone.View.extend({
    template: '<div class="form-group">' +
                '<label for="control-chart-type">Chart</label>' +
                '<select id="control-chart-type" class="form-control bind chosen-select">' +
                  '{{#graphTypes}}' +
                    '<option value="{{value}}" {{#selected}} selected{{/selected}}>{{name}}</option>' +
                  '{{/graphTypes}}' +
                '</select>' +
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
      var type = self.$('#control-chart-type').val();
      state.set('graphType', type);
      cb(state);
    }
  });

})(jQuery, window);