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
        state: self.state
      });
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    createSeries: function(records){
      var self = this;

      // Discrete barchart only support one serie.
      var serie = self.state.get('seriesFields')[0];
      records = records.toJSON();
      var data = {};
      data.key = serie;
      data.values = _.map(
        _.reportBy(records,self.state.get('xfield')), function(record){
        return {y: self.y(record, serie), x: self.x(record)};
      });

      return [data];
    }
  });

  my.discreteLineChartControls = recline.View.nvd3.BaseControl.extend({
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