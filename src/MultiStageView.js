;(function ($, my) {
  'use strict';

  my.MultiStageView = Backbone.View.extend({
    template: '<h3>{{title}}</h3><div id="step"></div>',
    events:{
      'click #next': 'nextStep',
      'click #prev': 'prevStep'
    },
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self._currentView = null;
      self._currentStep = 0;
      self.steps = [];
    },
    render: function(){
      var self = this;
      self.currentView = self.getStep(self._currentStep);
      console.log(self.currentView.stepInfo);
      self.$el.html(Mustache.render(self.template, self.currentView.stepInfo));

      self.assign(self.currentView, '#step');
      return self;
    },
    assign: function(view, selector){
      var self = this;
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
      self.currentView.updateState(self.state, function(newState){
        self.state = newState;
        self._currentStep = self.getNext(self.steps, self._currentStep);
        self.render();
      });
    },
    prevStep: function(){
      var self = this;
      self.currentView.updateState(self.state, function(newState){
        self.state = newState;
        self._currentStep = self.getPrev(self.steps, self._currentStep);
        self.render();
      });
    },
    getNext: function(steps, current){
      var limit = steps.length - 1;
      if(limit === current){
        return current;
      }
      return ++current;
    },
    getPrev: function(steps, current){
      if(current){
        return --current;
      }
      return current;
    }
  });

})(jQuery, window);