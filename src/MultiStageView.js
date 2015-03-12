;(function ($, my) {
  'use strict';

  my.MultiStageView = Backbone.View.extend({
    template: '<h3>{{title}}</h3>' +
              '<input type="hidden" value="{{state}}"/>' +
              '<div id="step"></div>',
    events:{
      'click #next': 'nextStep',
      'click #prev': 'prevStep'
    },
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.currentView = null;
      self.currentStep = self.state.get('step') || 0;
      self.steps = [];

      self.state.set('step', self.currentStep);
    },
    render: function(){
      var self = this;
      self.currentView = self.getStep(self.currentStep);
      _.extend(self.currentView.stepInfo, {state:JSON.stringify(self.state.toJSON())});
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
      var toNext = self.updateStep(self.getNext(self.steps, self.currentStep));
      self.currentView.updateState(self.state, toNext);
    },
    prevStep: function(){
      var self = this;
      var toPrev = self.updateStep(self.getPrev(self.steps, self.currentStep));
      self.currentView.updateState(self.state, toPrev);
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
    },
    updateStep: function(n){
      var self = this;
      return function(state){
        self.state = state;
        self.gotoStep(n);
        self.trigger('multistep:change', {step:n});
      };
    },
    gotoStep: function(n){
      var self = this;
      self.currentStep = n;
      self.state.set('step', self.currentStep);
      self.render();
    }
  });

})(jQuery, window);