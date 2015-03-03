;(function(){
  'use strict';

  $(document).on('ready', function(){
  	var state = new recline.Model.ObjectState();
    var sharedObject = {state: state};

  	var msv = new MultiStageView({
  		state: state,
  		el: $('#steps')
  	});

    msv.addStep(new LoadDataView(sharedObject));
    msv.addStep(new DataOptionsView(sharedObject));
    msv.addStep(new ChooseChartView(sharedObject));
    msv.addStep(new ChartOptionsView(sharedObject));
  	msv.addStep(new PublishView(sharedObject));
  	msv.render();

    // only useful in devel
    window.msv = msv;
    window.sharedObject = sharedObject;
  });

})(window);
