;(function ($, my) {
  'use strict';

  my.LoadDataView = Backbone.View.extend({
    template: '<div>Hello</div>',
    initialize: function(options){
      var self = this;
      //self.state = options.state;
    },
    render: function(){
      var self = this;
      this.$el.html(Mustache.render(self.template));
    },
    updateState: function(){
      // get ui state
      //self.state.set(uiState);
    }
  });

})(jQuery, window);