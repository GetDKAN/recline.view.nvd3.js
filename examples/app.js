'use strict';

function createStateDataset() {
  var dataset = new recline.Model.Dataset({
     records: [
      {id: 0, state: 'Idaho', total: 861, ratio: 776},
      {id: 1, state: 'Minnesota', total: 3017, ratio: 778},
      {id: 2, state: 'Hawaii', total: 652, ratio: 797},
      {id: 3, state: 'Iowa', total: 1365, ratio: 979},
      {id: 4, state: 'Oregon', total: 1630, ratio: 1028},
      {id: 5, state: 'Idaho', total: 1000, ratio: 500},
    ]
  });
  return dataset;
}

$(document).on('ready', function(){
  var dataset = createStateDataset();
  var $graphEl = $('#graph');
  window.graph = new recline.View.nvd3[(window.location.hash.substring(1) || "pieChart")]({
    model: dataset,
    el: $graphEl,
    y: function(record, serie){
      return record[serie];
    },
    x: function(record){
      return record.state;
    },
    state: {
      xfield: 'state',
      seriesFields: ['total', 'ratio'],
    },
  });
  graph.render();
});