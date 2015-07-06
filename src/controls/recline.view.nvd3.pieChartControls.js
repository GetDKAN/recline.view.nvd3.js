/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
'use strict';

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

})(jQuery, this.recline.View.nvd3, this.recline);

