/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.multiBarChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.menu = new my.multiBarChartControls({
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
        options: {
          reduceXTicks: false
        },
        computeXLabels: false,
      };
    }
  });

  my.multiBarChartControls = recline.View.nvd3.BaseControl.extend({
    // Tricky way to extend the backbone base template.
    _template:  '<div class="form-group">' +
                  '{{#options}}' +
                    '<label class="radio-inline">' +
                      '<input type="radio" name="control-chart-x-data-type" id="control-chart-x-data-type-{{value}}" value="{{value}}" {{#selected}}checked {{/selected}}> {{name}}' +
                    '</label>' +
                  '{{/options}}' +
                '</div>',

    initialize: function(options){
      var self = this;
      recline.View.nvd3.BaseControl.prototype.initialize.call(self, options);

    },
    render: function(){
      var self = this;
      var tmplData = {
        options:[
          {name:'Label', value: 'label', selected: true},
          {name:'Number', value: 'number', selected: false},
          {name:'Date', value: 'date', selected: false}
        ]
      };

      tmplData.options = _.map(tmplData.options, function(option, index){
        option.selected = (self.state.get('xDataType') === option.value)? true : false;
        return option;
      });

      recline.View.nvd3.BaseControl.prototype.render.call(self, {});
      self.$el.find('#control-chart-container').append(Mustache.render(self._template, tmplData ));
    },
    getUIState:function(){
      var self = this;
      var computedState = recline.View.nvd3.BaseControl.prototype.getUIState.call(self, {});
      computedState.xDataType = $('input[name=control-chart-x-data-type]:checked').val();
      computedState.computeXLabels = $('#control-chart-compute-x-labels').is(':checked');
      return computedState;
    }

  });

})(jQuery, recline.View.nvd3);