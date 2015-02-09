/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

my.BaseControl = Backbone.View.extend({
  template: '<form id="control-chart">' +
              '<div id="control-chart-container">' +
                '<div class="form-group">' +
                  '<label for="control-chart-source">Source</label>' +
                  '<input value="{{source}}" type="text" id="control-chart-source" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-series">Series</label>' +
                  '<select id="control-chart-series" multiple class="form-control chosen-select">' +
                    '{{#fields}}' +
                      '<option value="{{value}}" {{#selected}} selected{{/selected}}>{{name}}</option>' +
                    '{{/fields}}' +
                  '</select>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-xfield">X-Field</label>' +
                  '<select id="control-chart-xfield" class="form-control chosen-select">' +
                    '{{#xfields}}' +
                      '<option value="{{value}}" {{#selected}} selected{{/selected}}>{{name}}</option>' +
                    '{{/xfields}}' +
                  '</select>' +
                '</div>' +
                '<div class="form-group">' +
                  '{{#xDataTypes}}' +
                    '<label class="radio-inline">' +
                      '<input type="radio" name="control-chart-x-data-type" id="control-chart-x-data-type-{{value}}" value="{{value}}" {{#selected}}checked {{/selected}}> {{name}}' +
                    '</label>' +
                  '{{/xDataTypes}}' +
                '</div>' +
               '<div class="form-group">' +
                  '<label for="control-chart-x-format">X-Format</label>' +
                  '<input value="{{xFormat}}" type="text" id="control-chart-x-format" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-width">Width</label>' +
                  '<input value="{{width}}" type="text" id="control-chart-width" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-height">Height</label>' +
                  '<input value="{{height}}" type="text" id="control-chart-height" class="form-control" />' +
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
                  '<label for="control-chart-state">State</label>' +
                  '<input value="{{serialized}}" class="form-control"/>' +
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
              '</div>' +
              '<button id="control-chart-update" class="btn btn-primary">Update</button>' +
            '</form>',
  initialize: function(options){
    var self = this;
    self.state = options.state;
    self.model = options.model;
    self.parent = options.parent;

  },
  events: {
    'click #control-chart-update': 'update',
    'submit #control-chart': 'submit'
  },
  render: function(){
    var self = this;
    var state = _.cloneJSON(self.state);
    var htmls;
    var dataTypes;

    state.mode = 'widget';
    state.serialized = JSON.stringify(state);

    dataTypes = ['Number', 'String', 'Date', 'Auto'];

    // Populate option fields
    state.fields = self.applyOption(
      self.arrayToOptions(self.getFields()), self.state.get('seriesFields')
    );
    state.xDataTypes = self.applyOption(
      self.arrayToOptions(dataTypes), [self.state.get('xDataType') || 'Auto']
    );
    state.xfields = self.applyOption(
      self.arrayToOptions(self.getFields()), [self.state.get('xfield')]
    );


    htmls = Mustache.render(self.template, state);
    self.$el.html(htmls);
    self.$(".chosen-select").chosen({width: "95%"});
  },
  getFields: function(){
    var self = this;
    var fields = [];
    try{
      fields = _.pluck(self.parent.model.fields.toJSON(), 'id');
    } catch(err) {
      console.error('Error retrieving dataset fields');
    }
    return fields;
  },
  applyOption:function(options, selected){
    return _.map(options, function(option, index){
      option.selected = (_.inArray(selected, option.value))? true : false;
      return option;
    });
  },
  arrayToOptions: function(options){
    return _.map(options, function(option){
      return {name:option, value:option, selected: false};
    });
  },
  update: function(e){
    var self = this;
    e.preventDefault();
    var state = self.getUIState();
    try{
      self.validate(state);
      self.parent.setSavedState(state);
    } catch(err) {
      alert(err.message);
      console.error(err);
      self.render();
    }
  },
  validate: function(state){
    if(isNaN(state.width)){
      throw new Error("Width must be a number");
    }
    if(isNaN(state.height)){
      throw new Error("Height must be a number");
    }
  },
  submit: function(e){
    var self = this;
    e.preventDefault();
    self.update(e);

  },
  getUIState: function(){
    var self = this;
    var seriesFields = self.$el.find('#control-chart-series').val();
    seriesFields = _.invoke(seriesFields, 'trim');

    // FIX ME: point id to view dom
    var computedState = {
      width: $('#control-chart-width').val(),
      height: $('#control-chart-height').val(),
      seriesFields: seriesFields,
      xfield: $('#control-chart-xfield').val(),
      group: $('#control-chart-group').is(':checked'),
      source: $('#control-chart-source').val(),
      transitionTime: $('#control-chart-transition-time').val(),
      xDataType: $('input[name=control-chart-x-data-type]:checked').val(),
      xFormat: $('#control-chart-x-format').val()
    };

    computedState.options = computedState.options || {};
    computedState.options.xAxis = computedState.options.xAxis || {};
    computedState.options.tooltips = $('#control-chart-show-tooltips').is(':checked');
    computedState.options.xAxis.rotateLabels = $('#control-chart-label-x-rotation').val();

    return computedState;
  }
});

})(jQuery, recline.View.nvd3);