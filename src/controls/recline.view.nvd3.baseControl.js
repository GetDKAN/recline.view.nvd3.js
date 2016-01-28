/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
'use strict';
my.BaseControl = Backbone.View.extend({
  template: '<div id="control-chart-container">' +

              //////// X AXIS
              '<fieldset>' +
                '<legend>X Axis</legend>' +

                /// Format
                '<div class="form-group">' +
                  '<label for="control-chart-x-format">Format</label>' +
                  '<select class="form-control" id="control-chart-x-format">' +
                    '<optgroup label="Text">' +
                      '<option data-type="String" value="">Text</option>' +
                    '</optgroup>' +
                    '<optgroup label="Numbers">' +
                      '<option data-type="Number" value="d">100,000</option>' +
                      '<option data-type="Number" value=",.1f">100,000.0</option>' +
                      '<option data-type="Number" value=",.2f">100,000.00</option>' +
                      '<option data-type="Number" value="s">100K</option>' +
                    '</optgroup>' +
                    '<optgroup label="Date">' +
                      '<option data-type="Date" value="%m/%d/%Y">mm/dd/yyyy</option>' +
                      '<option data-type="Date" value=""%m-%d-%Y">mm-dd-yyyy</option>' +
                      '<option data-type="Date" value="%Y">Year</option>' +
                    '</optgroup>' +
                    '<optgroup label="Currency">' +
                      '<option data-type="Number" value="$,.2f">$100,000.00</option>' +
                      '<option data-type="Number" value="$,.1f">$100,000.0</option>' +
                      '<option data-type="Number" value="$,">$100,000</option>' +
                    '</optgroup>' +
                    '<optgroup label="Percentage">' +
                      '<option data-type="Number" value="%d">100,000%</option>' +
                      '<option data-type="Number" value="%,.1f">100,000.0%</option>' +
                      '<option data-type="Number" value="%,.2f">100,000.00%</option>' +
                    '</optgroup>' +
                  '</select>' +
                '</div>' +

                /// Rotation
                '<div class="form-group">' +
                  '<label for="control-chart-label-x-rotation">Label Rotation</label>' +
                  '<input value="{{options.xAxis.rotateLabels}}" type="text" id="control-chart-label-x-rotation" class="form-control" placeholder="e.g: -45"/>' +
                '</div>' +

                /// Axis label
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-12 col-sm-12">' +
                      '<label for="control-chart-x-axis-label">Axis Label</label>' +
                      '<input class="form-control" type="text" id="control-chart-x-axis-label" value="{{options.xAxis.axisLabel}}"/>' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                /// Axis ticks
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-9 col-sm-9">' +
                      '<label for="control-chart-x-values">Tick Values</label>' +
                      '<input class="form-control" type="text" placeholder="e.g. 2006-2015" id="control-chart-x-values" value="{{xValues}}"/>' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<label for="control-chart-x-values-step">Step</label>' +
                      '<input class="form-control" type="number" id="control-chart-x-values-step" value="{{xValuesStep}}"/>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</fieldset>' +

              //////// Y AXIS
              '<fieldset>' +
                '<legend>Y Axis</legend>' +

                /// Format
                '<div class="form-group">' +
                  '<label for="control-chart-y-format">Format</label>' +
                  '<select class="form-control" id="control-chart-y-format">' +
                    '<optgroup label="Text">' +
                      '<option data-type="String" value="">Text</option>' +
                    '</optgroup>' +
                    '<optgroup label="Numbers">' +
                      '<option data-type="Number" value="d">100,000</option>' +
                      '<option data-type="Number" value=",.1f">100,000.0</option>' +
                      '<option data-type="Number" value=",.2f">100,000.00</option>' +
                      '<option data-type="Number" value="s">100K</option>' +
                    '</optgroup>' +
                    '<optgroup label="Date">' +
                      '<option data-type="Date" value="%m/%d/%Y">mm/dd/yyyy</option>' +
                      '<option data-type="Date" value=""%m-%d-%Y">mm-dd-yyyy</option>' +
                      '<option data-type="Date" value="%Y">Year</option>' +
                    '</optgroup>' +
                    '<optgroup label="Currency">' +
                      '<option data-type="Number" value="$,.2f">$100,000.00</option>' +
                      '<option data-type="Number" value="$,.1f">$100,000.0</option>' +
                      '<option data-type="Number" value="$,">$100,000</option>' +
                    '</optgroup>' +
                    '<optgroup label="Percentage">' +
                      '<option data-type="Percentage" value="d">100,000%</option>' +
                      '<option data-type="Percentage" value=",.1f">100,000.0%</option>' +
                      '<option data-type="Percentage" value=",.2f">100,000.00%</option>' +
                    '</optgroup>' +
                  '</select>' +
                '</div>' +

                /// Rotation
                '<div class="form-group">' +
                  '<label for="control-chart-label-y-rotation">Label Rotation</label>' +
                  '<input value="{{options.yAxis.rotateLabels}}" type="text" id="control-chart-label-y-rotation" class="form-control" placeholder="e.g: -45"/>' +
                '</div>' +

                /// Axis label
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-9 col-sm-9">' +
                      '<label for="control-chart-y-axis-label">Axis Label</label>' +
                      '<input class="form-control" type="text" id="control-chart-y-axis-label" value="{{options.yAxis.axisLabel}}"/>' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<label for="control-chart-y-axis-label-distance">Distance</label>' +
                      '<input class="form-control" type="number" id="control-chart-y-axis-label-distance" value="{{options.yAxis.axisLabelDistance}}"/>' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                /// Axis ticks
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-9 col-sm-9">' +
                      '<label for="control-chart-y-values">Tick Values</label>' +
                      '<input class="form-control" placeholder="e.g. 0-50" type="text" id="control-chart-y-values" value="{{yValues}}"/>' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<label for="control-chart-y-values-step">Step</label>' +
                      '<input class="form-control" type="number" id="control-chart-y-values-step" value="{{yValuesStep}}"/>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</fieldset>' +

              //////// GENERAL
              '<fieldset>' +
                '<legend>General</legend>' +

                /// Color
                '<div class="form-group">' +
                    '<label for="control-chart-color">Color</label>' +
                    '<input class="form-control" type="text" id="control-chart-color" value="{{options.color}}" placeholder="e.g: #FF0000,green,blue,#00FF00"/>' +
                '</div>' +

                /// Transition time
                '<div class="form-group">' +
                  '<label for="control-chart-transition-time">Transition Time (milliseconds)</label>' +
                  '<input value="{{transitionTime}}" type="text" id="control-chart-transition-time" class="form-control" placeholder="e.g: 2000"/>' +
                '</div>' +

                /// Goal
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-12 col-sm-12">' +
                      '<label>Goal</label>' +
                    '</div>' +
                  '</div>' +
                  '<div class="row">' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-goal-value" type="text" class="form-control" aria-label="" placeholder="e.g.: 50" value="{{goal.value}}">' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-goal-color" type="text" class="form-control" aria-label="" placeholder="e.g.: red" value="{{goal.color}}">' +
                    '</div>' +
                    '<div class="col-md-6 col-sm-3">' +
                      '<div class="form-group checkbox checkbox-without-margin">' +
                        '<label for="control-chart-goal-outside">' +
                          '<input type="checkbox" id="control-chart-goal-outside" value="{{goal.outside}}" {{#goal.outside}}checked{{/goal.outside}}/> Label outside' +
                        '</label>' +
                      '</div>' +
                      '<div class="form-group checkbox checkbox-without-margin">' +
                        '<label for="control-chart-goal-label">' +
                          '<input type="checkbox" id="control-chart-goal-label" value="{{goal.label}}" {{#goal.label}}checked{{/goal.label}}/> Show label' +
                        '</label>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                /// Data sort
                '<div class="form-group">' +
                  '<label for="control-chart-sort">Sort</label>' +
                  '<select id="control-chart-sort" class="form-control chosen-select">' +
                    '{{#sortFields}}' +
                      '<option value="{{value}}" {{#selected}} selected{{/selected}}>{{name}}</option>' +
                    '{{/sortFields}}' +
                  '</select>' +
                '</div>' +

                /// Margin
                '<div class="form-group">' +
                  '<div class="row">' +
                    '<div class="col-md-12 col-sm-12">' +
                      '<label>Margin</label>' +
                    '</div>' +
                  '</div>' +
                  '<div class="row">' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-margin-top" type="text" class="form-control" aria-label="" placeholder="Top" value="{{options.margin.top}}">' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-margin-right" type="text" class="form-control" aria-label="" placeholder="Right" value="{{options.margin.right}}">' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-margin-bottom" type="text" class="form-control" aria-label="" placeholder="Bottom" value="{{options.margin.bottom}}">' +
                    '</div>' +
                    '<div class="col-md-3 col-sm-3">' +
                      '<input id="control-chart-margin-left" type="text" class="form-control" aria-label="" placeholder="Left" value="{{options.margin.left}}">' +
                    '</div>' +
                  '</div>' +
                '</div>' +

                /// Show title
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-show-title">' +
                    '<input type="checkbox" id="control-chart-show-title" value="{{showTitle}}" {{#showTitle}}checked{{/showTitle}}/> Show title' +
                  '</label>' +
                '</div>' +

                /// Show controls
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-show-controls">' +
                    '<input type="checkbox" id="control-chart-show-controls" value="{{options.showControls}}" {{#options.showControls}}checked{{/options.showControls}}/> Show controls' +
                  '</label>' +
                '</div>' +

                /// Show legend
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-show-legend">' +
                    '<input type="checkbox" id="control-chart-show-legend" value="{{options.showLegend}}" {{#options.showLegend}}checked{{/options.showLegend}}/> Show legend' +
                  '</label>' +
                '</div>' +

                /// Group
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-group">' +
                    '<input type="checkbox" id="control-chart-group" value="{{group}}" {{#group}}checked{{/group}}/> Group by X-Field' +
                  '</label>' +
                '</div>' +

                /// Show tooltips
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-show-tooltips">' +
                    '<input type="checkbox" id="control-chart-show-tooltips" {{#options.tooltips}}checked{{/options.tooltips}}/> Show Tooltips' +
                  '</label>' +
                '</div>' +

                /// Reduce ticks
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-reduce-ticks">' +
                    '<input type="checkbox" id="control-chart-reduce-ticks" {{#options.reduceXTicks}}checked{{/options.reduceXTicks}}/> Reduce Ticks' +
                  '</label>' +
                '</div>' +
              '</div>' +
            '</fieldset>',

  initialize: function(options){
    var self = this;
    self.state = options.state;
    self.model = options.model;
    self.parent = options.parent;
  },
  events: {
    'change input[type="checkbox"]': 'update',
    'change select': 'update',
    'blur input[type="text"]': 'update',
    'keydown input[type="text"]': 'update',
    'keydown input[type="number"]': 'update',
    'change input[type="number"]': 'update',
    'submit #control-chart': 'update'
  },
  render: function(){
    var self = this;
    var sortFields = _.arrayToOptions(_.getFields(self.state.get('model')));
    sortFields.unshift({name:'default', label:'Default', selected: false});
    self.state.set('sortFields', _.applyOption(sortFields, [self.state.get('sort')]));

    var options = self.state.get('options');
    options.margin = options.margin || {top: 15, right: 10, bottom: 50, left: 60};
    self.state.set('options', options);
    self.$el.html(Mustache.render(self.template, self.state.toJSON()));
    self.$('.chosen-select').chosen({width: '95%'});

    if(self.state.get('xFormat') && self.state.get('xFormat').format) {
      self.$('#control-chart-x-format option[value="' + self.state.get('xFormat').format + '"]').attr('selected', 'selected');
    }
    if(self.state.get('yFormat') && self.state.get('yFormat').format) {
      self.$('#control-chart-y-format option[value="' + self.state.get('yFormat').format + '"]').attr('selected', 'selected');
    }
  },
  update: function(e){
    var self = this;
    if(self.$(e.target).closest('.chosen-container').length) return;
    var newState = {};
    if(e.type === 'keydown' && e.keyCode !== 13) return;
    newState = _.merge({}, self.state.toJSON(), self.getUIState(), function(a, b) {
      if (_.isArray(a)) {
        return b;
      }
    });
    self.state.set(newState);
  },
  getUIState: function(){
    var self = this;
    var color;

    var computedState = {
      group: self.$('#control-chart-group').is(':checked'),
      transitionTime: self.$('#control-chart-transition-time').val(),
      xFormat:{
        type: self.$('#control-chart-x-format option:selected').data('type'),
        format: self.$('#control-chart-x-format option:selected').val()
      },
      yFormat:{
        type: self.$('#control-chart-y-format option:selected').data('type'),
        format: self.$('#control-chart-y-format option:selected').val()
      },
      sort: self.$('#control-chart-sort').val(),
      showTitle: self.$('#control-chart-show-title').is(':checked'),
      xValues: self.$('#control-chart-x-values').val(),
      yValues: self.$('#control-chart-y-values').val(),
      xValuesStep: parseInt(self.$('#control-chart-x-values-step').val() || 1),
      yValuesStep: parseInt(self.$('#control-chart-y-values-step').val() || 1),
    };
    computedState.options = computedState.options || {};
    computedState.options.xAxis = computedState.options.xAxis || {};
    computedState.options.yAxis = computedState.options.yAxis || {};
    computedState.options.tooltips = self.$('#control-chart-show-tooltips').is(':checked');
    computedState.options.showControls = self.$('#control-chart-show-controls').is(':checked');
    computedState.options.showLegend = self.$('#control-chart-show-legend').is(':checked');
    computedState.options.reduceXTicks = self.$('#control-chart-reduce-ticks').is(':checked');
    computedState.options.xAxis.rotateLabels = self.$('#control-chart-label-x-rotation').val();
    color = _.invoke(self.$('#control-chart-color').val().split(','), 'trim');
    computedState.options.xAxis.axisLabel = self.$('#control-chart-x-axis-label').val();
    computedState.options.yAxis.axisLabel = self.$('#control-chart-y-axis-label').val();
    computedState.options.yAxis.axisLabelDistance = parseInt(self.$('#control-chart-y-axis-label-distance').val()) || 0;
    if(self.$('#control-chart-color').val()){
      computedState.options.color = color;
    } else {
      if(computedState.options.color){
        delete computedState.options.color;
      }
    }
    var margin = {
      top: parseInt(self.$('#control-chart-margin-top').val()),
      right: parseInt(self.$('#control-chart-margin-right').val()),
      bottom: parseInt(self.$('#control-chart-margin-bottom').val()),
      left: parseInt(self.$('#control-chart-margin-left').val()),
    };
    var goal = {
      value: parseFloat(self.$('#control-chart-goal-value').val()) || '',
      color: self.$('#control-chart-goal-color').val(),
      outside: self.$('#control-chart-goal-outside').is(':checked'),
      label: self.$('#control-chart-goal-label').is(':checked'),
    };
    computedState.goal = goal;
    computedState.options.margin = margin;
    return computedState;
  }
});

})(jQuery, recline.View.nvd3);
