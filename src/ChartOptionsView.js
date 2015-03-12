;(function ($, my) {
  'use strict';

  my.ChartOptionsView = Backbone.View.extend({
    template: '<div class="col-md-12" id="chart-with-controls">' +
                '<div class="col-md-7">' +
                  '<ul class="nav nav-tabs" role="tablist" id="myTab">' +
                    '<li role="presentation" class="active"><a href="#chart-tab" aria-controls="home" role="tab" data-toggle="tab">Chart</a></li>' +
                    '<li role="presentation"><a href="#dataset-tab" aria-controls="settings" role="tab" data-toggle="tab">Dataset</a></li>' +
                  '</ul>' +
                  '<div class="tab-content">' +
                    '<div role="tabpanel" class="tab-pane active" id="chart-tab">' +
                      '<div  id="chart-viewport"></div>' +
                      '<div class="form-group">' +
                        '<label>Source</label>' +
                        '<div>{{source.url}}</div>'+
                      '</div>' +
                      '<div class="form-group">' +
                        '<label>X Field</label>' +
                        '<div>{{xfield}}</div>'+
                      '</div>' +
                      '<div class="form-group">' +
                        '<label>Series fields</label>' +
                        '<div>{{seriesFields}}</div>'+
                      '</div>' +
                      '<div class="form-group">' +
                        '<label>Graph Type</label>' +
                        '<div>{{graphType}}</div>'+
                      '</div>' +
                    '</div>' +
                    '<div role="tabpanel" class="tab-pane" id="dataset-tab">' +
                      '<div id="pager"></div>' +
                      '<div id="grid"></div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div class="col-md-5" id="controls">' +
                  '<div id="base-controls"></div>' +
                  '<div id="extended-controls"></div>' +
                '</div>' +
              '</div>' +
              '<div class="col-md-12" id="controls">' +
                '<div id="prev" class="btn btn-default pull-left">Back</div>' +
                '<button type="submit" class="form-submit btn btn-success pull-right">Finish</button>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.stepInfo = {
        title: 'Preview and Adjust',
        name: 'chartOptions'
      };
    },
    render: function(){
      console.log('ChartOptionsView::render');
      var self = this;
      var graphType = self.state.get('graphType');

      self.$el.html(Mustache.render(self.template, self.state.toJSON()));

      // Common controls for all the charts.
      self.baseControls = new recline.View.nvd3.BaseControl({
        model: self.state.get('model'),
        state: self.state,
        parent: self
      });

      // Controls available only for this graphType.
      self.extendedControls = new recline.View.nvd3[graphType + 'Controls']({
        model: self.state.get('model'),
        state: self.state
      });

      // Chart itself.
      self.graph = new recline.View.nvd3[graphType]({
        model: self.state.get('model'),
        state: self.state
      });
      // Grid
      self.grid = new recline.View.SlickGrid({
        model: self.state.get('model'),
        el: $('#grid'),
        options:{}
      });
      self.grid.visible = true;

      self.assign(self.graph, '#chart-viewport');
      self.assign(self.baseControls, '#base-controls');
      self.assign(self.extendedControls, '#extended-controls');
      self.assign(self.grid, '#grid');

      // Slickgrid needs to update after tab content is displayed
      $('#grid')
        .closest('.tab-content')
        .prev()
        .find('a[data-toggle="tab"]')
        .on('shown.bs.tab', function () {
          self.grid.grid.resizeCanvas();
        });

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