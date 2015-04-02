/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
  'use strict';

  my.pieChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'pieChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    alterChart: function(chart){
      var self = this;

      // we don't want labels to fill all the canvas.
      if(self.series.length > 10){
        chart.showLegend(false);
      }
    },
    createSeries: function(records){
      var self = this;
      records = records.toJSON();
      var serie = _.first(self.state.get('seriesFields'));
      // Group by xfield and acum all the series fields.
      records = (self.state.get('group'))?
        _.reportBy(records, self.xfield, self.state.get('seriesFields'))
        : records;
      return  _.map(records, function(record){
        var rc = {};
        rc.y = record[serie];
        return _.defaults(record, rc);
      });
    }
  });

})(jQuery, recline.View.nvd3);