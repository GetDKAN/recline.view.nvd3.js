/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
 'use strict';

  my.EmbedControl = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group">' +
                '<label for="control-chart-width">Width</label>' +
                '<input value="{{width}}" type="text" id="control-chart-width" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-height">Height</label>' +
                '<input value="{{height}}" type="text" id="control-chart-height" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                '<input type="hidden" value="{{serialized}}" class="form-control"/>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-embed">Embed Code</label>' +
                '<input value="{{embedCode}}" class="form-control"/>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-embed">Url</label>' +
                '<input value="{{url}}" class="form-control"/>' +
              '</div>',
    embedTmpl: '<iframe src="{{{source}}}" width="{{width}}" height="{{height}}" frameBorder="0" style="overflow:hidden" scrolling="no"></iframe>',
    events: {
      'change input[type="checkbox"]': 'update',
      'blur input[type="text"]': 'update',
      'keydown input[type="text"]': 'update',
    },
    update: function(e){
      var self = this;
      var newState = {};
      if(e.type === 'keydown' && parseInt(e.keyCode) !== 13) return;
      newState = _.merge({}, self.state.toJSON(), self.getUIState());
      self.state.set(newState, {silent:true});
    },
    getUIState:function(){
      var self = this;
      var computedState = {
        width: self.$('#control-chart-width').val(),
        height: self.$('#control-chart-height').val(),
      };
      return computedState;
    }
  });
})(jQuery, recline.View.nvd3);