/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
  'use strict';

  my.linePlusBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      console.log('init',self, options);
      self.graphType = 'linePlusBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
    },
    render: function(){
      var self = this;
      console.log('render', self);
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    alterChart: function(chart) {
      
      chart
        .x(function(d,i) { 
					console.log('x',d,i); 
					return i; 
        })
        .y(function(d,i) {
          console.log('y', d.y,i); 
          return d.y; 
        });
      chart.y1Axis
          .tickFormat(d3.format(',f'));
      chart.y2Axis
          .tickFormat(d3.format(',f'));
			chart.options({focusEnable: false});
      chart.bars.forceY([0]);
      chart.lines.forceY([0]);
    }
  });

})(jQuery, recline.View.nvd3);
