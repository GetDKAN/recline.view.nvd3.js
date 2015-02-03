/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.discreteBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'discreteBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
      self.menu = new my.discreteBarChartControls({
        model: self.model,
        state: self.state,
        parent: self
      });
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    }
  });

  my.discreteBarChartControls = recline.View.nvd3.BaseControl.extend({
    initialize: function(options){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.render.call(self, {});
    }
  });
})(jQuery, recline.View.nvd3);