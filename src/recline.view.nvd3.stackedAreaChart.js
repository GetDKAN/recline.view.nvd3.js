/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

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
      var self = this;
      return {
        options:{
          useInteractiveGuideline: true,
          tooltips: true,
          xAxis:{
            tickFormat: function(d) {
              return d3.time.format('%Y')(new Date(d))
              //return (self.chartMap) ? self.chartMap.get(id) : id;
            }
          }
        }
      };
    }
  });

  my.stackedAreaChartControls = recline.View.nvd3.BaseControl.extend({
    template:  '<div class="form-group checkbox">' +
                  '<label for="control-chart-compute-x-labels">' +
                    '<input type="checkbox" id="control-chart-compute-x-labels" {{#computeXLabels}}checked{{/computeXLabels}}/> Force x as labels' +
                  '</label>' +
                '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.computeXLabels = self.$('#control-chart-compute-x-labels').is(':checked');
      return computedState;
    }
  });
})(jQuery, recline.View.nvd3);