;(function ($, my) {
  'use strict';

  my.LoadDataView = Backbone.View.extend({
    template: '<div class="form-group">' +
                '<label for="control-chart-source">Source</label>' +
                '<input value="{{source.url}}" type="text" id="control-chart-source" class="form-control" />' +
              '</div>' +
              '<div class="form-group">' +
                '<select id="control-chart-backend" class="form-control">' +
                  '<option value="csv">CSV</option>' +
                  '<option value="gdocs">Google Spreadsheet</option>' +
                  '<option value="ckan">DataProxy</option>' +
                '</select>' +
              '</div>' +
              '<div id="controls">' +
                '<div id="next" class="btn btn-primary pull-right">Next</div>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.model = self.options.model;
      self.stepInfo = {
        title: 'Load Data',
        name: 'loadData'
      };
    },
    render: function(){
      var self = this;
      self.$el.html(Mustache.render(self.template, self.state.toJSON()));
    },
    updateState: function(state, cb){
      var self = this;
      var url = self.$('#control-chart-source').val();
      var backend = self.$('#control-chart-backend').val();
      var source = {
        backend: backend,
        url: url
      };
      state.set('model', new recline.Model.Dataset(source));
      state.set('source', source);
      state.get('model').fetch().done(function(){
        cb(state);
      });
    }
  });

})(jQuery, window);