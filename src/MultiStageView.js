;(function ($, my) {
  'use strict';

  my.MultiStageView = Backbone.View.extend({
    template: '<div class="container">' +
                '<div id="step"></div>' +
                '<div id="controls">' +
                  '<div id="prev">Back</div>' +
                  '<div id="next">Next</div>' +
                '</div>' +
              '</div>',
    initialize: function(options){
      var self = this;
      self.state = options.state;
      self._currentView = null;
      self._currentStep = 0;
      self.steps = [];
    },
    render: function(){
      var self = this;
      self.$el.html(Mustache.render(self.template));
      self.currentView = self.getStep(self._currentStep);
      self.assign(self.currentView, '#step');
    },
    assign: function(view, selector){
      var self = this;
      console.log($(selector));
      view.setElement(self.$(selector)).render();
    },
    addStep: function(view){
      var self = this;
      self.steps.push(view);
    },
    getStep: function(index){
      var self = this;
      return self.steps[index];
    },
    nextStep: function(){
      var self = this;
      self._currentStep++;
    },
    prevStep: function(){
      self._currentStep--;
    }
  });

})(jQuery, window);