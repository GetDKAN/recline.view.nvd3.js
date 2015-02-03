/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.scatterChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'scatterChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', true);
      self.menu = new my.scatterChartControls({
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
        showDistX: true,
        showDistY: true,
        onlyCircles: false,
        xAxis:{
          tickFormat: function(id) {
            return (self.chartMap) ? self.chartMap.get(id) : id;
          }
        }
      };
    }
  });

  my.scatterChartControls = recline.View.nvd3.BaseControl.extend({
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