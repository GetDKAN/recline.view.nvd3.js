/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
'use strict';
my.BaseControl = Backbone.View.extend({
  template: '<div id="control-chart-container">' +
              '<div class="form-group">' +
                '<label for="control-chart-x-format">X-Format</label>' +
                '<input value="{{xFormat}}" type="text" id="control-chart-x-format" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-label-x-rotation">Label X Rotation</label>' +
                '<input value="{{options.xAxis.rotateLabels}}" type="text" id="control-chart-label-x-rotation" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-transition-time">Transition Time</label>' +
                '<input value="{{transitionTime}}" type="text" id="control-chart-transition-time" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-color">Color</label>' +
                  '<input class="form-control" type="text" id="control-chart-color" value="{{options.color}}"/>' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-x-axis-label">X Axis Label</label>' +
                  '<input class="form-control" type="text" id="control-chart-x-axis-label" value="{{options.xAxis.axisLabel}}"/>' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-x-axis-label">Y Axis Label</label>' +
                  '<input class="form-control" type="text" id="control-chart-y-axis-label" value="{{options.yAxis.axisLabel}}"/>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-group">' +
                  '<input type="checkbox" id="control-chart-group" value="{{group}}" {{#group}}checked{{/group}}/> Group by X-Field' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-tooltips">' +
                  '<input type="checkbox" id="control-chart-show-tooltips" {{#options.tooltips}}checked{{/options.tooltips}}/> Show Tooltips' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-reduce-ticks">' +
                  '<input type="checkbox" id="control-chart-reduce-ticks" {{#options.reduceXTicks}}checked{{/options.reduceXTicks}}/> Reduce Ticks' +
                '</label>' +
              '</div>' +
            '</div>',

  initialize: function(options){
    var self = this;
    self.state = options.state;
    self.model = options.model;
    self.parent = options.parent;
  },
  events: {
    'change input[type="checkbox"]': 'update',
    'blur input[type="text"]': 'update',
    'keydown input[type="text"]': 'update',
    'submit #control-chart': 'update'
  },
  render: function(){
    var self = this;
    self.$el.html(Mustache.render(self.template, self.state.toJSON()));
    self.$('.chosen-select').chosen({width: '95%'});
  },
  update: function(e){
    var self = this;
    var newState = {};
    if(e.type === 'keydown' && e.keyCode !== 13) return;
    newState = _.merge({}, self.state.toJSON(), self.getUIState());
    self.state.set(newState);
  },
  getUIState: function(){
    var self = this;
    var color;

    var computedState = {
      group: $('#control-chart-group').is(':checked'),
      transitionTime: $('#control-chart-transition-time').val(),
      xFormat: $('#control-chart-x-format').val()
    };
    computedState.options = computedState.options || {};
    computedState.options.xAxis = computedState.options.xAxis || {};
    computedState.options.yAxis = computedState.options.yAxis || {};
    computedState.options.tooltips = self.$('#control-chart-show-tooltips').is(':checked');
    computedState.options.reduceXTicks = self.$('#control-chart-reduce-ticks').is(':checked');
    computedState.options.xAxis.rotateLabels = self.$('#control-chart-label-x-rotation').val();
    color = _.invoke(self.$('#control-chart-color').val().split(','), 'trim');
    computedState.options.xAxis.axisLabel = $('#control-chart-x-axis-label').val();
    computedState.options.yAxis.axisLabel = $('#control-chart-y-axis-label').val();
    if(self.$('#control-chart-color').val()){
      computedState.options.color = color;
    } else {
      if(computedState.options.color){
        console.log('deleting');
        delete computedState.options.color;
      }
    }
    return computedState;
  }
});

})(jQuery, recline.View.nvd3);