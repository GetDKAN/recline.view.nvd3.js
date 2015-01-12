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
      width: 600,
      graphType: "discreteBarChart",
      xfield: "state",
      seriesFields: ["total.foreclosures", "foreclosure.ratio"],
      group: true,
      options: {
        staggerLabels: true,
        tooltips: true
      }
    },
  });
  graph.render();

  $(".series-fields").select2({
    data: [{id: 0, text: "total.foreclosures"}, {id:1, text: "foreclosure.ratio"}, {id:2, text: "state"}]
  })
  $(".series-fields").val([0,1]).trigger("change");
  $("#xfield").select2({
    data: [{id: 0, text: "total.foreclosures"}, {id:1, text: "foreclosure.ratio"}, {id:2, text: "state"}]
  })
  $("#xfield").val([2]).trigger("change");

  $(".bind").change(update.bind());

  function update(change) {
    var datasource = $("#source").val();
    var ajax_options = reclineCSV(datasource);
    $.ajax(ajax_options).done(function(data) {
      var dataset;
      // Converts line endings in either format to unix format.
      data = data.replace(/(\r\n|\n|\r)/gm,"\n");
      var records = CSV.parse(data);
      dataset = new recline.Model.Dataset({
        records: records,
        size: 10,
        query: {
          size: 10
        }
      });
      var query = new recline.Model.Query({size:10});
      dataset.query(query);
      dataset.fetch();
      var fields = [];
      for (var i = 0; i < dataset.fields.length; i++) {
        fields.push({"id": i, "text": dataset.fields.models[i].id});
      };
      if ($(change.target).hasClass('datasource')) {
        $(".series-fields").select2("destroy");
        $(".series-fields").empty();
        $(".series-fields").select2({
          data: fields
        });
        $(".series-fields").val([1]).trigger("change");
        $("#xfield").select2("destroy");
        $("#xfield").empty();
        $("#xfield").select2({
          data: fields
        });
        $("#xfield").val([0]).trigger("change");
      }

      var seriesFields = [];
      $('.series-fields :selected').each(function(s, select) {
        seriesFields[s] = $(select).text();
      });
      seriesFields = seriesFields.join(',');

      var height = $("#height").val();
      var width = $("#width").val();
      var type = $("#switch option:selected").val();
      var xfield = fields[$("#xfield").val()].text;
      var group = $('#group').is(':checked');
      var staggerLabels = $('#stagger-labels').is(':checked');
      var tooltips = $('#tooltips').is(':checked');
      var showValues = $('#show-values').is(':checked');
      var xLabel = $("#x-axis-label").val();
      if (xLabel) {
        graph.state.attributes.options.xAxis = graph.state.attributes.options.xAxis || {};
        graph.state.attributes.options.xAxis.axisLabel = xLabel;
      }
      var yLabel = $("#y-axis-label").val();
      if (yLabel) {
        graph.state.attributes.options.yAxis = graph.state.attributes.options.yAxis || {};
        graph.state.attributes.options.yAxis.axisLabel = yLabel;
      }
      graph.state.set('xfield', xfield);
      graph.state.set('graphType',type);
      graph.state.set('group', group);
      graph.state.attributes.options.staggerLabels = staggerLabels;
      graph.state.attributes.options.tooltips = tooltips;
      graph.state.attributes.options.showValues = showValues;
      graph.state.attributes.height = height;
      graph.state.attributes.width = width;
      graph.state.set('seriesFields', seriesFields.split(","));
      graph.model = dataset;
      graph.render();
      grid.model = dataset;
      grid.render();
    });
  };
});

function createStateDataset() {
  var dataset = new recline.Model.Dataset({
     records: [
      {id: 0, state: 'Idaho', "total.foreclosures": 861, "foreclosure.ratio": 776},
      {id: 1, state: 'Minnesota', "total.foreclosures": 3017, "foreclosure.ratio": 778},
      {id: 2, state: 'Hawaii', "total.foreclosures": 652, "foreclosure.ratio": 797},
      {id: 3, state: 'Iowa', "total.foreclosures": 1365, "foreclosure.ratio": 979},
      {id: 4, state: 'Oregon', "total.foreclosures": 1630, "foreclosure.ratio": 1028},
      {id: 5, state: 'Idaho', "total.foreclosures": 1000, "foreclosure.ratio": 500},
    ]
  });
  return dataset;
};

function reclineCSV(file) {
  var options = {delimiter: ","};

  var ajax_options = {
      type: 'GET',
      url: file,
      dataType: 'text'
  };
  ajax_options.timeout = 500;
  ajax_options.error = function(x, t, m) {
      if (t === "timeout") {
          $('.data-explorer').append('<div class="messages status">File was too large or unavailable for preview.</div>');
      } else {
          $('.data-explorer').append('<div class="messages status">Data preview unavailable.</div>');
      }
  };

  return ajax_options;
}

