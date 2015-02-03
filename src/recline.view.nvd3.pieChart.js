/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.pieChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'pieChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.menu = new my.pieChartControls({
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
      records = records.toJSON();
      var serie = self.state.get('seriesFields')[0];
      // Group by xfield and acum all the series fields.
      records = (self.state.get('group'))?
        _.reportBy(records, self.state.get('xfield'), self.state.get('seriesFields'))
        : records;
      return  _.map(records, function(record){
        return {y: self.y(record, serie), x: self.x(record, self.state.get('xfield'))};
      });
    },
    getDefaults: function(){
      var self = this;
      return {
        showLabels: true,
        labelType: 'percent'
      };
    }
  });

  my.pieChartControls = recline.View.nvd3.BaseControl.extend({
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