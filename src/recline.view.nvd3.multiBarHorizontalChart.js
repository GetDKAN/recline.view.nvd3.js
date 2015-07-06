/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my, recline) {
  'use strict';

  my.multiBarHorizontalChart = recline.View.nvd3.Base.extend({
    initialize: function(options) {
      var self = this;
      self.graphType = 'multiBarHorizontalChart';
      recline.View.nvd3.Base.prototype.initialize.call(self, options);
      self.state.set('computeXLabels', false);
    },
    render: function(){
      var self = this;
      recline.View.nvd3.Base.prototype.render.call(self, {});
    },
    getDefaults: function(){
      return {
        options: {
          tooltips: true,
          reduceXTicks: false,
        }
      };
    }
  });

})(jQuery, this.recline.View.nvd3, this.recline);
