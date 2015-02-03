;(function(global){
  'use strict';

  $(document).on('ready', function(){
    global.router = new recline.URLState({init: function(state){
      var dataset = demoFieldAsSeries();
      var $graphEl = $('#graph');
      var viewer = new recline.View.nvd3.polimorphic({
        model: dataset,
        el: $graphEl,
        graphType: state.currentView || 'lineChart',
        state: state,
        options:{
          hey:true,
        }
      });


    }});
  });

})(window);
