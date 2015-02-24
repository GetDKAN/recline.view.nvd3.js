/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

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
      var self = this;
      return {
        options: {
          tooltips: true,
          reduceXTicks: false,
        }
      };
    }
  });

  my.multiBarHorizontalChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group checkbox">' +
                '<label for="control-chart-compute-x-labels">' +
                '<input type="checkbox" id="control-chart-compute-x-labels" {{#computeXLabels}}checked{{/computeXLabels}}/> X values as labels' +
                '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.computeXLabels = $('#control-chart-compute-x-labels').is(':checked');
      return computedState;
    }
  });
})(jQuery, recline.View.nvd3);