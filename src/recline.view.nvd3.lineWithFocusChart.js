/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.lineWithFocusChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'lineWithFocusChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    createSeries: function(records){
      var self = this;
      records = records.toJSON();
      self.chartMap = d3.map();

      return _.map(self.state.get('seriesFields'), function(serie){
        var data = {};
        data.key = serie;
        data.values = _.map(records, function(record, index){
          self.chartMap.set(index, self.x(record));
          return {y: self.y(record, serie), x: index, label: self.x(record)};
        });
        return data;
      });
    },
    getDefaults: function(){
      var self = this;
      return {
        xAxis:{
          tickFormat: function(id) {
            return (self.chartMap) ? self.chartMap.get(id) : id;
          }
        }
      };
    }
  });

})(jQuery, recline.View.nvd3);