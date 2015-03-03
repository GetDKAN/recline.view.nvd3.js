;(function ($, my) {
  'use strict';

  my.PublishView = Backbone.View.extend({
    template: '<div class="col-md-12" id="chart-with-controls">' +
                '<div class="col-md-7">' +
                  '<div  id="chart-viewport"></div>' +
                '</div>' +
                '<div class="col-md-5" id="controls">' +
                  '<div id="embed-control"></div>' +
                '</div>' +
              '</div>' +
              '<div class="col-md-12" id="controls">' +
                '<div id="prev" class="btn btn-default pull-left">Back</div>' +
                '<div id="next" class="btn btn-success pull-right">Publish</div>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.stepInfo = {
        title: 'Publish and Share',
        name: 'publish'
      };
    },
    render: function(){
      console.log('ChartOptionsView::render');
      var self = this;
      var graphType = self.state.get('graphType');

      self.$el.html(Mustache.render(self.template, self.state.toJSON()));

      // Common controls for all the charts.
      self.embedControl = new recline.View.nvd3.EmbedControl({
        model: self.state.get('model'),
        state: self.state,
        parent: self
      });

      // Chart itself.
      self.graph = new recline.View.nvd3[graphType]({
        model: self.state.get('model'),
        state: self.state
      });

      self.assign(self.graph, '#chart-viewport');
      self.assign(self.embedControl, '#embed-control');

      self.$('.chosen-select').chosen({width: '95%'});
    },
    updateState: function(state, cb){
      cb(state);
    },
    assign: function(view, selector){
      var self = this;
      view.setElement(self.$(selector)).render();
    },
  });

})(jQuery, window);