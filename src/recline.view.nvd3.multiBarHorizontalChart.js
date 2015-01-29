/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.multiBarHorizontalChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarHorizontalChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    createSeries: function(records){
      var self = this;
      records = records.toJSON();

      return _.map(self.state.get('seriesFields'), function(serie){
        var data = {};
        data.key = serie;
        data.values = _.map(
          _.reportBy(records,self.state.get('xfield')), function(record){
          return {y: self.y(record, serie), x:self.x(record)};
        });

        return data;
      });
    },
    getDefaults: function(){
      var self = this;
      return {
        reduceXTicks: false,
      };
    }
  });

})(jQuery, recline.View.nvd3);