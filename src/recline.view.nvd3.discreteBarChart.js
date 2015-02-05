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
        computeXLabels: false,
      };
    }
  });

  my.discreteBarChartControls = recline.View.nvd3.BaseControl.extend({
    _template: '<div class="form-group checkbox">' +
                '<label for="control-chart-show-values">' +
                '<input type="checkbox" id="control-chart-show-values" {{#options.showValues}}checked{{/options.showValues}}/> Show Values' +
                '</label>' +
              '</div>',
    initialize: function(options){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.initialize.call(self, options);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.render.call(self, {});
      self.$el.find('#control-chart-container').append(Mustache.render(self._template, self.state.toJSON()));
    },
    getUIState:function(){
      var self = this;
      var computedState = recline.View.nvd3.BaseControl.prototype.getUIState.call(self, {});
      computedState.options.showValues = $('#control-chart-show-values').is(':checked');
      return computedState;
    }
  });
})(jQuery, recline.View.nvd3);