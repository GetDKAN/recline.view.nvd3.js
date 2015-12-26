'use strict';
define(['rv3', 'lodash'], function (Base, _) {
 console.log("LODASsH", _.map); 
  var pieChart = Base.extend({
    initialize: function(options) {
			console.log('pc1');
      var self = this;
      self.graphType = 'pieChart';
      Base.prototype.initialize.call(self, options);
    },
    render: function(){
      console.log('pc2');
      var self = this;
      Base.prototype.render.call(self, {});
    },
    alterChart: function(chart){
      var self = this;
      console.log('pc3');
      // we don't want labels to fill all the canvas.
      if(self.series.length > 10){
        chart.showLegend(false);
      }
    },
    createSeries: function(records){
      var self = this;
      console.log('pc4');
      records = records.toJSON();
      var serie = _.first(self.state.get('seriesFields'));
      // Group by xfield and acum all the series fields.
      records = (self.state.get('group'))?
        _.reportBy(records, self.state.get('xfield'), self.state.get('seriesFields'))
        : records;
      return  _.map(records, function(record){
        return {y: self.cleanupY(self.y(record, serie)), x: self.x(record, self.state.get('xfield'))};
      });
    },
    getDefaults: function(){
      console.log('pc5');
      return {
        options: {
          showLabels: true,
          labelType: 'percent',
          tooltips:true
        }
      };
    }
  });
	return pieChart;
});
