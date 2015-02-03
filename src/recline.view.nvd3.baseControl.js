/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

my.BaseControl = Backbone.View.extend({
  template: '<form id="control-chart">' +
              '<div id="control-chart-container">' +
                '<div class="form-group">' +
                  '<label for="control-chart-width">Width</label>' +
                  '<input value="{{width}}" type="text" id="control-chart-width" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-height">Height</label>' +
                  '<input value="{{height}}" type="text" id="control-chart-height" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-series">Series</label>' +
                  '<input value="{{seriesFields}}" type="text" id="control-chart-series" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-xfield">x-field</label>' +
                  '<input value="{{xfield}}" type="text" id="control-chart-xfield" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-state">State</label>' +
                  '<input value="{{serialized}}" class="form-control"/>' +
                '</div>' +
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-group">' +
                  '<input type="checkbox" id="control-chart-group" value="{{group}}" {{#group}}checked{{/group}}/> Group' +
                  '</label>' +
                '</div>' +
                '<div class="form-group checkbox">' +
                  '<label for="control-chart-stagger-labels">' +
                  '<input type="checkbox" id="control-chart-stagger-labels" {{#options.staggerLabels}}checked{{/options.staggerLabels}}/> Stagger Labels' +
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
    self.render();
  },
  events: {
    'click #control-chart-update': 'update',
    'submit #control-chart': 'submit'
  },
  render: function(){
    var self = this;
    var state = self.state.toJSON();
    state.serialized = JSON.stringify(self.state.toJSON());
    var htmls = Mustache.render(self.template, state);
    self.$el.html(htmls);
  },
  update: function(e){
    var self = this;
    var state = self.getUIState();
    try{
      self.validate(state);
      self.parent.setSavedState(state);
    } catch(err) {
      alert(err.message);
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

    var seriesFields = self.$el.find('#control-chart-series').val().split(',');
    seriesFields = _.invoke(seriesFields, 'trim');

    // FIX ME: point id to view dom
    var computedState = {
      width: $('#control-chart-width').val(),
      height: $('#control-chart-height').val(),
      seriesFields: seriesFields,
      xfield: $('#control-chart-xfield').val(),
      group: $('#control-chart-group').is(':checked'),
    };

    computedState.options = computedState.options || {};
    computedState.options.staggerLabels = $('#control-chart-stagger-labels').is(':checked');
    computedState.options.tooltips = $('#control-chart-show-tooltips').is(':checked');
    return computedState;
  }
});

})(jQuery, recline.View.nvd3);