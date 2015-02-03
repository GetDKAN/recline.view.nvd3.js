/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

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
    createSeries: function(records){
      var self = this;
      records = records.toJSON();
      var serie = self.state.get('seriesFields')[0];
      console.log(self.state.get('seriesFields'));
      return  _.map(records, function(record){
        return {y: self.y(record, serie), x: self.x(record)};
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

})(jQuery, recline.View.nvd3);