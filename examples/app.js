;(function(global){
  'use strict';

  $(document).on('ready', function(){
    var dataset = demoFieldAsSeries();
    var $graphEl = $('#graph');
    var router = new recline.URLState();
    window.viewer = new recline.View.nvd3.polimorphic({
      model: dataset,
      el: $graphEl,
      router: router,
    });

  });

})(window);
