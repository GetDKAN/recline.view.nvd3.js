/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
  'use strict';

  my.linePlusBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'linePlusBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    alterChart: function(chart) {
      chart
        .x(function(d,i) { 
					return i;//d.x; 
        })
        .y(function(d,i) {
          return d.y; 
        });
      chart.options({focusEnable: false});

    },
    
		getDefaults: function () {
      return {
        options: {
          tooltips: true,
          showLegend: true,
        }
      }
    }

  });

})(jQuery, recline.View.nvd3);
