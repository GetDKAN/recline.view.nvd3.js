/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
'use strict';

  my.scatterChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group">' +
                '<label for="control-chart-point-size">Point size field</label>' +
                  '<input class="form-control" type="text" id="control-chart-point-size" value="{{options.pointSize}}" placeholder="e.g: percentage"/>' +
              '</div>',
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.pointSize = self.$('#control-chart-point-size').val();
      return computedState;
    }

  });
})(jQuery, recline.View.nvd3);

