/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

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
      var self = this;
      return {
        computeXLabels: false,
      };
    }
  });

  my.multiBarChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group checkbox">' +
                '<label for="control-chart-stagger-labels">' +
                '<input type="checkbox" id="control-chart-stagger-labels" {{#options.staggerLabels}}checked{{/options.staggerLabels}}/> Stagger Labels' +
                '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.computeXLabels = self.$('#control-chart-compute-x-labels').is(':checked');
      computedState.options.staggerLabels = self.$('#control-chart-stagger-labels').is(':checked');
      return computedState;
    }

  });

})(jQuery, recline.View.nvd3);