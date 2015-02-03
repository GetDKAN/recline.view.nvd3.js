;(function(global){
  'use strict';

  $(document).on('ready', function(){
    var dataset = demoFieldAsSeries();
    var $graphEl = $('#graph');
    var router = new recline.URLState();
    var viewer = new recline.View.nvd3.polimorphic({
      model: dataset,
      controls: false,
      el: $graphEl,
      state: {"width":"640","height":"481","group":true,"computeXLabels":true,"options":{"reduceXTicks":false,"hey":true},"seriesFields":["total","ratio"],"xfield":"state","currentView":"multiBarHorizontalChart"},
      router: router,
      options:{}
    });
  });

})(window);
