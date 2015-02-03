/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

(function ($, my) {

  my.polimorphic = recline.View.nvd3.Base.extend({
    template:   '<div class="form-group">' +
                  '<label for="control-chart-type">Chart</label>' +
                  '<select id="control-chart-type" class="form-control bind">' +
                    '<option value="discreteBarChart">Discrete Bar</option>' +
                    '<option value="multiBarChart">Multi Bar</option>' +
                    '<option value="stackedAreaChart">Stacked Area</option>' +
                    '<option value="multiBarHorizontalChart">Mulit Bar Horizontal</option>' +
                    '<option value="pieChart">Pie</option>' +
                    '<option value="lineChart">Line</option>' +
                    '<option value="lineWithFocusChart">Line with Focus</option>' +
                    '<option value="scatterChart">Scatter</option>' +
                    '<option value="linePlusBarWithFocusChart">Line Plus Bar With Focus</option>' +
                    '<option value="linePlusBarChart">linePlusBarChart</option>-->' +
                  '</select>' +
                '</div>',

    events: {
      'change #control-chart-type': 'changeChart'
    },
    initialize: function(options) {
      var self = this;
      var state = options.state;
      self.router = options.router;
      delete options.state;

      self.graphType = (self.router.getCurrentState() && self.router.getCurrentState().currentView) || 'lineChart';
      self.graph = new recline.View.nvd3[self.graphType](options);
      var urlState = self.router.getCurrentState();

      self.graph.setSavedState(urlState || state);

      self.render();
      self.graph.state.on('change', function(e){
        self.render();
        self.router.navigateToState(e);
      });

    },
    render: function(){
      var self = this;
      self.graph.render();
      self.graph.menu.$el.prepend(Mustache.render(self.template));
      self.graph.menu.$el.find('option[value="' + self.graph.graphType + '"]').attr('selected', 'selected');
    },
    getCurrentView: function(){
      var self = this;
      return self.graph;
    },
    changeChart: function(e){
      var self = this;
      var savedState = _.cloneJSON(self.graph.state);
      self.graphType = savedState.currentView = $(e.target).val();

      self.graph = new recline.View.nvd3[self.graphType](self.options);
      self.graph.setSavedState(savedState);
      self.router.navigateToState(self.graph.state);
      self.render();

      self.graph.state.on('change', function(e){
        self.render();
        self.router.navigateToState(e);
      });
    },
    destroy: function(){
      self.graph.state.off();
    }

  });

})(jQuery, recline.View.nvd3);