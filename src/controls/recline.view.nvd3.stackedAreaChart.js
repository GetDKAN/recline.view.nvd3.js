/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
'use strict';

  my.stackedAreaChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group checkbox">' +
                '<label for="control-chart-use-interactive-guideline">' +
                  '<input type="checkbox" id="control-chart-use-interactive-guideline" {{#options.useInteractiveGuideline}}checked{{/options.useInteractiveGuideline}}/> Use interactive guideline' +
                '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.useInteractiveGuideline = self.$('#control-chart-use-interactive-guideline').is(':checked');
      return computedState;
    }
  });

})(jQuery, recline.View.nvd3);

