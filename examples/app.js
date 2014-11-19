jQuery(function($) {

  // Create the demo dataset.
  var dataset = createStateDataset();

  var $gridEl = $('#grid');
  var grid = new recline.View.SlickGrid({
    model:dataset,
    el: $gridEl,
  });
  grid.visible = true;
  grid.render();

  var $graphEl1 = $('#graph1');
  var graph1 = new recline.View.nvd3({
    model: dataset,
    el: $graphEl1,
    state: {
      height: 400,
      width: 400,
      graphType: "multiBarChart",
      // Label field.
      xfield: "state",
      seriesFields: ["total", "ratio"],
      group: true
    }
  });
  graph1.render(); 
  var $graphEl2 = $('#discreteBarChart');
  var graph2 = new recline.View.nvd3({
    model: dataset,
    el: $graphEl2,
    state: {
      height: 400,
      width: 400,
      graphType: "discreteBarChart",
      // Label field.
      xfield: "state",
      yfield: "total",
      group: true
    }
  });
  graph2.render(); 
  var $graphEl3 = $('#pieChart');
  var graph3 = new recline.View.nvd3({
    model: dataset,
    el: $graphEl3,
    state: {
      height: 400,
      width: 400,
      graphType: "pieChart",
      // Label field.
      xfield: "state",
      yfield: "total",
      group: true
    }
  });
  graph3.render(); 
   var $multiBarHorizontalChart = $('#multiBarHorizontalChart');
  var multiBarHorizontalChart = new recline.View.nvd3({
    model: dataset,
    el: $multiBarHorizontalChart,
    state: {
      height: 400,
      width: 400,
      graphType: "multiBarHorizontalChart",
      // Label field.
      xfield: "state",
      seriesFields: ["total"],
      group: true
    }
  });
  multiBarHorizontalChart.render(); 
 var $lineChart = $('#lineChart1');
  var lineChart = new recline.View.nvd3({
    model: dataset,
    el: $lineChart,
    state: {
      height: 400,
      width: 400,
      graphType: "lineChart",
      // Label field.
      xfield: "id",
      seriesFields: ["total", "ratio"],
      group: true
    }
  });
  lineChart.render();
 var $lineChart2 = $('#lineChart2');
  var lineChart2 = new recline.View.nvd3({
    model: dataset,
    el: $lineChart2,
    state: {
      height: 400,
      width: 400,
      graphType: "lineWithFocusChart",
      // Label field.
      xfield: "id",
      seriesFields: ["total", "ratio"],
      group: true
    }
  });
  lineChart2.render();
  var $scatterChart = $('#scatterChart');
  var scatterChart = new recline.View.nvd3({
    model: dataset,
    el: $scatterChart,
    state: {
      height: 400,
      width: 400,
      graphType: "scatterChart",
      // Label field.
      xfield: "id",
      seriesFields: ["total", "ratio"],
//      group: true
    }
  });
  scatterChart.render();

 var $stackedAreaChart = $('#stackedAreaChart');
  var stackedAreaChart = new recline.View.nvd3({
    model: dataset,
    el: $stackedAreaChart,
    state: {
      height: 400,
      width: 400,
      graphType: "stackedAreaChart",
      // Label field.
      xfield: "id",
      seriesFields: ["total", "ratio"],
      group: true
    }
  });
  stackedAreaChart.render();  

  
});

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

// create standard demo dataset
function createDemoDataset() {
  var dataset = new recline.Model.Dataset({
    records: [
      {id: 0, date: '2011-01-01', x: 1, y: 2, z: 1, country: 'DE', title: 'first', lat:52.56, lon:13.40},
      {id: 1, date: '2011-02-02', x: 2, y: 4, z: 1, country: 'UK', title: 'second', lat:54.97, lon:-1.60},
      {id: 2, date: '2011-03-03', x: 3, y: 6, z: 1, country: 'US', title: 'third', lat:40.00, lon:-75.5},
      {id: 3, date: '2011-04-04', x: 4, y: 8, z: 2, country: 'DE', title: 'fourth', lat:57.27, lon:-6.20},
      {id: 4, date: '2011-05-04', x: 5, y: 10, z: 2, country: 'UK', title: 'fifth', lat:51.58, lon:0},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UB', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UC', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UD', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UE', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UF', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UG', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UH', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UI', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UJ', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UK', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'UL', title: 'sixth', lat:51.04, lon:7.9},
      {id: 6, date: '2011-06-02', x: 6, y: 24, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9}

    ],
    // let's be really explicit about fields
    // Plus take opportunity to set date to be a date field and set some labels
    fields: [
      {id: 'id'},
      {id: 'date', type: 'date'},
      {id: 'x', type: 'number'},
      {id: 'y', type: 'number'},
      {id: 'z', type: 'number'},
      {id: 'country', 'label': 'Country'},
      {id: 'title', 'label': 'Title'},
      {id: 'lat'},
      {id: 'lon'}
    ]
  });
  return dataset;
}

// make MultivView
//
// creation / initialization in a function so we can call it again and again
var createMultiView = function(dataset, state) {
  // remove existing multiview if present
  var reload = false;
  if (window.multiView) {
    window.multiView.remove();
    window.multiView = null;
    reload = true;
  }

  var $el = $('<div />');
  $el.appendTo(window.explorerDiv);

  // customize the subviews for the MultiView
  var views = [
    {
      id: 'grid',
      label: 'Grid',
      view: new recline.View.SlickGrid({
        model: dataset,
        state: {
          gridOptions: {
            editable: true,
            // Enable support for row add
            enabledAddRow: true,
            // Enable support for row delete
            enabledDelRow: true,
            // Enable support for row ReOrder
            enableReOrderRow:true,
            autoEdit: false,
            enableCellNavigation: true
          },
          columnsEditor: [
            { column: 'date', editor: Slick.Editors.Date },
            { column: 'title', editor: Slick.Editors.Text }
          ]
        }
      })
    },
    {
      id: 'map',
      label: 'Map',
      view: new recline.View.Map({
        model: dataset
      })
    }
  ];

  var multiView = new recline.View.MultiView({
    model: dataset,
    el: $el,
    state: state,
    views: views
  });
  return multiView;
}
