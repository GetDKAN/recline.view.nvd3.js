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
      var serie = _.first(self.state.get('seriesFields'));
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
        options: {
          showLabels: true,
          labelType: 'percent',
          tooltips:true
        }
      };
    }
  });

  my.pieChartControls = recline.View.nvd3.BaseControl.extend({
    template:'<div class="form-group checkbox">' +
                  '<label for="control-chart-donut">' +
                  '<input type="checkbox" id="control-chart-donut" {{#options.donut}}checked{{/options.donut}}/> Donut' +
                  '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.donut = self.$('#control-chart-donut').is(':checked');
      return computedState;
    }

  });
})(jQuery, recline.View.nvd3);