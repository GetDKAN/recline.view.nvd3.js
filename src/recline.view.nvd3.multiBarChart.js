/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.multiBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.menu = new my.multiBarChartControls({
        model: self.model,
        state: self.state,
        parent: self
      });
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});

    },
    getDefaults: function(){
      var self = this;
      return {
        options: {
          reduceXTicks: false
        },
        computeXLabels: false,
      };
    }
  });

  my.multiBarChartControls = recline.View.nvd3.BaseControl.extend({

    initialize: function(options){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.initialize.call(self, options);

    },
    render: function(){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.render.call(self, {});
    },
    getUIState:function(){
      var self = this;
      var computedState = recline.View.nvd3.BaseControl.prototype.getUIState.call(self, {});
      computedState.computeXLabels = $('#control-chart-compute-x-labels').is(':checked');
      return computedState;
    }

  });

})(jQuery, recline.View.nvd3);