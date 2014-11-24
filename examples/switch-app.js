$(document).ready(function(){


  // Create the demo dataset.
  var dataset = createStateDataset();

  var $gridEl = $('#grid');
  var grid = new recline.View.SlickGrid({
    model:dataset,
    el: $gridEl,
  });
  grid.visible = true;
  grid.render();

  var $graphEl = $('#graph');
  var graph = new recline.View.nvd3({
    model: dataset,
    el: $graphEl,
    state: {
      height: 400,
      width: 400,
      graphType: "discreteBarChart",
      xfield: "state",
      seriesFields: ["total", "ratio"],
      group: true,
      options: {
        staggerLabels: true,
        tooltips: true,
      }
    },

  });
  graph.render();

  $("#switch").change(function() {
    update();
  });
  $("#xfield").change(function() {
    update();
  });
  $("#group").change(function() {
    update();
  });
  $("#seried-fields").change(function() {
    update();
  });
  $("#x-axis-label").change(function() {
    update();
  });
  $("#y-axis-label").change(function() {
    update();
  });
  $("#height").change(function() {
    update();
  });
  $("#width").change(function() {
    update();
  });
  $("#stagger-labels").change(function() {
    update();
  });
  $("#tooltips").change(function() {
    update();
  });
  $("#tooltips").change(function() {
    update();
  });
  $("#show-values").change(function() {
    update();
  });  
  function update() {
    var height = $("#height").val();
    var width = $("#width").val();
    var type = $("#switch option:selected").val();
    var xfield = $("#xfield").val();
    var seriesFields = $("#seried-fields").val();
    var group = false;
    var staggerLabels = false;
    var tooltips = false;
    var showValues = false;
    if ($('#group').is(':checked')) {
      group = true;
    }
    if ($('#stagger-labels').is(':checked')) {
      staggerLabels = true;
    }
    if ($('#tooltips').is(':checked')) {
      tooltips = true;
    }
    if ($('#show-values').is(':checked')) {
      showValues = true;
    }      
    var xLabel = $("#x-axis-label").val();
    if (xLabel) {
      graph.state.attributes.xLabel = xLabel;
    }
    var yLabel = $("#y-axis-label").val();
    if (yLabel) {
      graph.state.attributes.yLabel = yLabel;
    }
    graph.state.attributes.xfield = xfield;
    graph.state.attributes.graphType = type;
    graph.state.attributes.group = group;
    graph.state.attributes.options.staggerLabels = staggerLabels;
    graph.state.attributes.options.tooltips = tooltips;
    graph.state.attributes.options.showValues = showValues;

    graph.state.attributes.height = height;
    graph.state.attributes.width = width;

    graph.state.attributes.seriesFields = seriesFields.split(",");
    graph.render(); 
  }

  
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
