/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
  'use strict';

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
      return {
        options: {
          tooltips: true,
          reduceXTicks: false,
        }
      };
    },
      renderGoals: function(){
        var self = this;
        var goal = self.state.get('goal');
        nv.dispatch.on('render_end', null);
        if(this.canRenderGoal(goal)){
          nv.dispatch.on('render_end', function(){
            var yScale = self.chart.yAxis.scale();
            var margin = self.chart.margin();
            var y = yScale(goal.value) + margin.top;
            var x = margin.left;
            var xHeight = (d3.select('svg').size())? parseInt(d3.select('svg').style('height')) - 10 : 0;
            var g = d3.select('svg').append('g');
            var labelX, labelY;

            if(goal.label) {
              labelX =  x + 15;
              labelY = y + 15;
              g.append('text')
              .text('TARGET')
              .attr('x', labelY)
              .attr('y', labelX)
              .attr('fill', goal.color || 'red' )
              .style('font-size','10px')
              .style('font-weight','bold')
              .style('font-style','italic');
            }

            g.append('line')
            .attr('class', 'goal')
            .attr('y1', x - 10)
            .attr('x1', y + 10)
            .attr('y2', xHeight - 90)
            .attr('x2', y + 10)
            .attr('stroke-width', 1)
            .attr('stroke', goal.color || 'red')
            .style('stroke-dasharray', ('3, 3'));
          });
        }
      }
  });

})(jQuery, recline.View.nvd3);
