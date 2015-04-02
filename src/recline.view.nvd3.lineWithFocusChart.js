/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
  'use strict';

  my.lineWithFocusChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'lineWithFocusChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true, {silent:true});
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    alterChart: function(chart){
      // Focus axis should have the same formater as x
      chart.x2Axis.tickFormat(chart.xAxis.tickFormat());
    }
  });

})(jQuery, recline.View.nvd3);