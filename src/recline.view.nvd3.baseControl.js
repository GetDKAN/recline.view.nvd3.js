/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

my.BaseControl = Backbone.View.extend({
  template: '' +
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
                '<input type="checkbox" id="control-chart-group" {{#group}}checked{{/group}}/> Group' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-compute-x-labels">' +
                '<input type="checkbox" id="control-chart-compute-x-labels" {{#computeXLabels}}checked{{/computeXLabels}}/> X as label' +
                '</label>' +
              '</div>' +
              '<button id="control-chart-update" class="btn btn-primary">Update</button>' +
            '',
  initialize: function(options){
    var self = this;
    self.state = options.state;
    self.model = options.model;
    self.render();
  },
  events: {
    'click #control-chart-update': 'update'
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
    console.log(self.$el.find('#control-chart-compute-x-labels').is(':checked'));
    var seriesFields = self.$el.find('#control-chart-series').val().split(',');
    seriesFields = _.invoke(seriesFields, 'trim');
    self.state.set({
      width: self.$el.find('#control-chart-width').val(),
      height: self.$el.find('#control-chart-height').val(),
      seriesFields: seriesFields,
      xfield: self.$el.find('#control-chart-xfield').val(),
      group: self.$el.find('#control-chart-group').is(':checked'),
      computeXLabels: self.$el.find('#control-chart-compute-x-labels').is(':checked'),
    });
  }
});

})(jQuery, recline.View.nvd3);