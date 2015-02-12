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
                    '<option value="linePlusBarChart">Line Plus Bar</option>-->' +
                  '</select>' +
                '</div>',
    events: {
      'change #control-chart-type': 'changeChart'
    },
    initialize: function(options) {
      console.log('Polimorphic::initialize');
      var self = this;
      var state = options.state;
      var urlState = options.router.getCurrentState() || {};
      var datasetOptions;

      delete options.state;

      self.router = options.router;
      self.graphType = (urlState && urlState.currentView) || 'discreteBarChart';
      self.graph = new recline.View.nvd3[self.graphType](options);

      if(urlState.source) {
        datasetOptions = {
          url: urlState.source,
          backend: 'csv'
        };
      } else {
        datasetOptions = {records: []};
      }

      self.graph.model = new recline.Model.Dataset(datasetOptions);
      self.graph.model.fetch().done(self.render.bind(self));
      self.graph.setSavedState(urlState || state);
      self.graph.state.on('change', self.onStateChange.bind(self));
    },
    renderGrid: function(model){
      var $gridEl = $('#grid');
      grid = new recline.View.SlickGrid({
        model: model,
        el: $gridEl,
        options:{
           autoExpandColumns: true
        }
      });
      grid.visible = true;
      grid.render();
    },
    onStateChange:function(e){
      var self = this;
      if(_.has(self.graph.state.changed, 'source')){
        self.graph.model = new recline.Model.Dataset({
          url: self.graph.state.changed.source,
          backend: 'csv'
        });
        self.graph.model.fetch().done(self.render.bind(self));
        self.renderGrid(self.graph.model);
      }else {
        self.render();
      }
      self.router.navigateToState(e);
    },
    render: function(){
      var self = this;
      self.graph.render();
      self.graph.menu.$el.prepend(Mustache.render(self.template));
      self.graph.menu.$el.find('option[value="' + self.graph.graphType + '"]').attr('selected', 'selected');
      if(!self.graph.state.get('mode') || self.graph.state.get('mode') === 'edit'){
        self.renderGrid(self.graph.model);
      }
    },
    getCurrentView: function(){
      var self = this;
      return self.graph;
    },
    changeChart: function(e){
      console.log('Polimorphic::changeChart');
      var self = this;
      var savedState = _.cloneJSON(self.graph.state.toJSON());
      var dataset = self.graph.model;

      self.graphType = savedState.currentView = $(e.target).val();
      self.graph = new recline.View.nvd3[self.graphType](self.options);
      self.graph.model = dataset;
      self.graph.setSavedState(savedState);
      self.router.navigateToState(self.graph.state);
      self.render();
      self.graph.state.on('change', self.onStateChange.bind(self));
    },
    destroy: function(){
      self.graph.state.off();
    }

  });

})(jQuery, recline.View.nvd3);