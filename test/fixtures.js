function demoFieldAsSeries() {
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

function demoValuesAsSeries(){
  var dataset = new recline.Model.Dataset({
    records: [
      {id: 0, date: '2011-01-01', x: 1, y: 210, z: 1, country: 'DE', title: 'first', lat:52.56, lon:13.40},
      {id: 1, date: '2011-02-02', x: 2, y: 312, z: 1, country: 'UK', title: 'second', lat:54.97, lon:-1.60},
      {id: 2, date: '2011-03-03', x: 3, y: 645, z: 1, country: 'US', title: 'third', lat:40.00, lon:-75.5},
      {id: 3, date: '2011-04-04', x: 4, y: 123, z: 2, country: 'DE', title: 'fourth', lat:57.27, lon:-6.20},
      {id: 4, date: '2011-05-04', x: 5, y: 756, z: 2, country: 'UK', title: 'fifth', lat:51.58, lon:0},
      {id: 6, date: '2011-06-02', x: 6, y: 132, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9},
      {id: 7, date: '2011-06-02', x: 6, y: 345, z: 2, country: 'UB', title: 'sixth', lat:51.04, lon:7.9},
      {id: 9, date: '2011-06-02', x: 6, y: 384, z: 2, country: 'UC', title: 'sixth', lat:51.04, lon:7.9},
      {id: 10, date: '2011-05-02', x: 6, y: 549, z: 2, country: 'UD', title: 'sixth', lat:51.04, lon:7.9},
      {id: 11, date: '2011-07-02', x: 6, y: 490, z: 2, country: 'UE', title: 'sixth', lat:51.04, lon:7.9},
      {id: 12, date: '2011-05-02', x: 6, y: 423, z: 2, country: 'UF', title: 'sixth', lat:51.04, lon:7.9},
      {id: 13, date: '2011-03-03', x: 6, y: 567, z: 2, country: 'UG', title: 'sixth', lat:51.04, lon:7.9},
      {id: 14, date: '2011-02-02', x: 6, y: 876, z: 2, country: 'UH', title: 'sixth', lat:51.04, lon:7.9},
      {id: 15, date: '2011-01-01', x: 6, y: 341, z: 2, country: 'UI', title: 'sixth', lat:51.04, lon:7.9},
      {id: 16, date: '2011-05-04', x: 6, y: 965, z: 2, country: 'UJ', title: 'sixth', lat:51.04, lon:7.9},
      {id: 17, date: '2011-06-02', x: 6, y: 342, z: 2, country: 'UK', title: 'sixth', lat:51.04, lon:7.9},
      {id: 18, date: '2011-07-02', x: 6, y: 876, z: 2, country: 'UL', title: 'sixth', lat:51.04, lon:7.9},
      {id: 19, date: '2011-06-02', x: 6, y: 765, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9}
    ]
  });
  return dataset;
}
