;(function(global){
  'use strict';

  $(document).on('ready', function(){
    // var $graphEl = $('#graph');
    // var router = new recline.URLState();
    // window.viewer = new recline.View.nvd3.polimorphic({
    //   el: $graphEl,
    //   router: router,
    // });
  	var state = new recline.Model.ObjectState();
    window.sharedObject = {state: state};

  	window.msv = new MultiStageView({
  		state: state,
  		el: $('#steps')
  	});
    msv.addStep(new LoadDataView(sharedObject));
    msv.addStep(new DataOptionsView(sharedObject));
    msv.addStep(new ChooseChartView(sharedObject));
    msv.addStep(new ChartOptionsView(sharedObject));
  	msv.addStep(new PublishView(sharedObject));
  	msv.render();

  });

})(window);
