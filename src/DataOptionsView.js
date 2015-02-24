;(function ($, my) {
  'use strict';

  my.DataOptionsView = Backbone.View.extend({
    template: '<div class="form-group">' +
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
                '<div id="controls">' +
                  '<div id="prev" class="btn btn-default pull-left">Back</div>' +
                  '<div id="next" class="btn btn-primary pull-right">Next</div>' +
                '</div>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.stepInfo = {
        title: 'Define Variables',
        name: 'dataOptions'
      };
    },
    render: function(){
      var self = this;
      var dataTypes = ['Number', 'String', 'Date', 'Auto'];

      self.state.set('fields', _.applyOption(
        _.arrayToOptions(_.getFields(self.state.get('model'))), self.state.get('seriesFields')
      ));
      self.state.set('xfields', _.applyOption(
        _.arrayToOptions(_.getFields(self.state.get('model'))), [self.state.get('xfield')]
      ));
      self.state.set('xDataTypes', _.applyOption(
        _.arrayToOptions(dataTypes), [self.state.get('xDataType') || 'Auto']
      ));

      self.$el.html(Mustache.render(self.template, self.state.toJSON()));
      self.$('.chosen-select').chosen({width: '95%'});
    },
    updateState: function(state, cb){
      var self = this;
      state.set('seriesFields', self.$('#control-chart-series').val());
      state.set('xfield', self.$('#control-chart-xfield').val());
      state.set('xDataType', self.$('input[name=control-chart-x-data-type]:checked').val());
      cb(state);
    }
  });

})(jQuery, window);