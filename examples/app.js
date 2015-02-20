;(function(global){
  'use strict';

  $(document).on('ready', function(){
    var $graphEl = $('#graph');
    var router = new recline.URLState();
    window.viewer = new recline.View.nvd3.polimorphic({
      el: $graphEl,
      router: router,
    });

  });

})(window);
