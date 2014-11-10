## Recline NVD3 View

### Usage

```
  // Create the demo dataset.
  var dataset = new recline.Model.Dataset({
    records: [
      {id: 0, date: '2011-01-01', x: 1, y: 2, z: 3, country: 'DE', title: 'first', lat:52.56, lon:13.40},
      {id: 1, date: '2011-02-02', x: 2, y: 4, z: 24, country: 'UK', title: 'second', lat:54.97, lon:-1.60},
      {id: 2, date: '2011-03-03', x: 3, y: 6, z: 9, country: 'US', title: 'third', lat:40.00, lon:-75.5},
      {id: 3, date: '2011-04-04', x: 4, y: 8, z: 6, country: 'UK', title: 'fourth', lat:57.27, lon:-6.20},
      {id: 4, date: '2011-05-04', x: 5, y: 10, z: 15, country: 'UK', title: 'fifth', lat:51.58, lon:0},
      {id: 5, date: '2011-06-02', x: 6, y: 12, z: 18, country: 'DE', title: 'sixth', lat:51.04, lon:7.9}
    ],
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

  var $graphEl = $('#graph');
  var graph = new recline.View.nvd3({
    model: dataset,
    el: $graphEl,
    state: {
      height: 400,
      width: 400,
      graphType: "pieChart",
      // Label field.
      xfield: "country",
      // Value field.
      yfield: "z",
      // Group label field values.
      group: true
    }
  });
  graph.render();
```


