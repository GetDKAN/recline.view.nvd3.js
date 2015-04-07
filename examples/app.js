;(function(){
  'use strict';

  $(document).on('ready', function(){
    var datasetWithLabels = demoFieldAsSeries();
    var datasetWithValues = demoValuesAsSeries();

    var oneDimensionWithLabels = new recline.Model.ObjectState({
      seriesFields: ['total'],
      group: true,
      options: {
        tooltips: true,
        x: 'state'
      }
    });

    var twoDimensionWithLabels = new recline.Model.ObjectState({
      seriesFields: ['total', 'ratio'],
      group: true,
      options: {
        x: 'state',
        tooltips: true
      }
    });

    var twoDimensionWithValues = new recline.Model.ObjectState({
      seriesFields: ['y', 'z'],
      options: {
        x: 'date',
        tooltips: true,
        xAxis: {
          tickFormat: 'Date::%x'
        }
      }
    });

    /**
     * Discrete Bar Chart
     */
    var discreteBarChart = new recline.View.nvd3.discreteBarChart({
        model: datasetWithLabels,
        state: oneDimensionWithLabels,
        el: $('#discreteBar'),
    });
    discreteBarChart.render();

    /**
     * Multi Bar Chart
     */
    var multiBarChart = new recline.View.nvd3.multiBarChart({
        model: datasetWithLabels,
        state: twoDimensionWithLabels,
        el: $('#multiBarChart'),
    });
    multiBarChart.render();


    /**
     * Line Chart
     */
    var lineChart = new recline.View.nvd3.lineChart({
        model: datasetWithValues,
        state: twoDimensionWithValues,
        el: $('#lineChart'),
    });
    lineChart.render();

    /**
     * Multi Horizontal Bar Chart
     */
    var multiBarHorizontalChart = new recline.View.nvd3.multiBarHorizontalChart({
        model: datasetWithLabels,
        state: twoDimensionWithLabels,
        el: $('#multiBarHorizontalChart'),
    });
    multiBarHorizontalChart.render();

    /**
     * Pie Chart
     */
    var pieChartState = new recline.Model.ObjectState({
      seriesFields: ['total'],
      group: true,
      options: {
        x: 'state',
        tooltips: true
      }
    });

    var pieChart = new recline.View.nvd3.pieChart({
        model: datasetWithLabels,
        state: pieChartState,
        el: $('#pieChart'),
    });
    pieChart.render();

    /**
     * Stacked Area
     */
    var stackedAreaChart = new recline.View.nvd3.stackedAreaChart({
        model: datasetWithValues,
        state: twoDimensionWithValues,
        el: $('#stackedAreaChart'),
    });
    stackedAreaChart.render();

    /**
     * Cumulative Line Chart
     */
    var cumulativeLineState = new recline.Model.ObjectState({
      seriesFields: ['y', 'z'],
      options: {
        x: 'date',
        tooltips: true,
        useInteractiveGuideline: true,
        color: d3.scale.category10().range(),

      }
    });
    var cumulativeLineChart = new recline.View.nvd3.cumulativeLineChart({
        model: datasetWithValues,
        state: cumulativeLineState,
        el: $('#cumulativeLineChart'),
    });
    cumulativeLineChart.render();

    /**
     * Scatter Chart
     */

    var scatterChartState = new recline.Model.ObjectState({
      seriesFields: ['y', 'x'],
      options: {
        x: 'date',
        tooltips: true,
        pointSize: 'z',
        tooltipContent: '<h3 style="background-color: <%= e.color %>"><%= key %></h3><p><%= y %></p>',
      }
    });
    var scatterChart = new recline.View.nvd3.scatterChart({
        model: datasetWithValues,
        state: scatterChartState,
        el: $('#scatterChart'),
    });
    scatterChart.render();

    /**
     * Line With Focus Chart
     */
    var lineWithFocusChart = new recline.View.nvd3.lineWithFocusChart({
        model: datasetWithValues,
        state: twoDimensionWithValues,
        el: $('#lineWithFocusChart'),
    });
    lineWithFocusChart.render();

    // DEV ONLY
    var dev = true;
    if(dev) {
      window.lineChart = lineChart;
      window.lineWithFocusChart = lineWithFocusChart;
      window.pieChart = pieChart;
      window.discreteBarChart = discreteBarChart;
      window.multiBarHorizontalChart = multiBarHorizontalChart;
      window.multiBarChart = multiBarChart;
      window.scatterChart = scatterChart;
      window.stackedAreaChart = stackedAreaChart;
      window.cumulativeLineChart = cumulativeLineChart;
    }
  });

})(window);
