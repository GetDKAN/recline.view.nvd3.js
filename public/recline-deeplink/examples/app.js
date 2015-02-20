'use strict';

// Create standard demo dataset.
function createDemoDataset() {
  var dataset = new recline.Model.Dataset({
    records: [
      {id: 0, date: '2011-01-01', x: 1, y: 2, z: 3, country: 'DE', title: 'first', lat:52.56, lon:13.40, Dist_ID:12}, // jshint ignore:line
      {id: 1, date: '2011-02-02', x: 2, y: 4, z: 24, country: 'UK', title: 'second', lat:54.97, lon:-1.60, Dist_ID:11}, // jshint ignore:line
      {id: 2, date: '2011-03-03', x: 3, y: 6, z: 9, country: 'US', title: 'third', lat:40.00, lon:-75.5, Dist_ID:16}, // jshint ignore:line
      {id: 3, date: '2011-04-04', x: 4, y: 8, z: 6, country: 'UK', title: 'fourth', lat:57.27, lon:-6.20, Dist_ID:32}, // jshint ignore:line
      {id: 4, date: '2011-05-04', x: 5, y: 10, z: 15, country: 'UK', title: 'fifth', lat:51.58, lon:0, Dist_ID:60}, // jshint ignore:line
      {id: 5, date: '2011-06-02', x: 6, y: 12, z: 18, country: 'DE', title: 'sixth', lat:51.04, lon:7.9, Dist_ID:12} // jshint ignore:line
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
      {id: 'lon'},
      {id: 'Dist_ID'}
    ]
  });
  return dataset;
}

/**
 * Make a multiview. initialization in a function so we
 * can call it again and again.
 * @param  {Array}
 * @param  {ObjectState}
 * @return {recline.View.MultiView}
 */
function createMultiView(dataset, state) {
  // Remove existing multiview if present.
  var reload = false;
  if (window.multiView) {
    window.multiView.remove();
    window.multiView = null;
    reload = true;
  }

  var $el = $('<div />');
  $el.appendTo(window.explorerDiv);

  // Customize the subviews for the MultiView.
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
      id: 'graph',
      label: 'Graph',
      view: new recline.View.Graph({
        model: dataset

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

jQuery(function($) {
  window.explorerDiv = $('.data-explorer-here');

  // create the demo dataset
  var dataset = createDemoDataset();

  // now create the multiview
  // this is rather more elaborate than the minimum as we configure the
  // MultiView in various ways (see function below)
  var multiview = createMultiView(dataset);
  var router = new recline.DeepLink.Router(multiview.state);

  var map = multiview.pageViews[2].view.map;
  router.addDependency(new recline.DeepLink.Deps.Map(map, router));

  router.start({
    init:function(state){
      if (state && !_.isEmpty(state)) {
        state = _.extend(multiview.state.attributes, state);
        multiview.model.queryState.set(state.query);
        multiview.updateNav(state.currentView || 'grid');
        _.each(multiview.pageViews, function(view, index){
          var viewKey ='view-' + view.id;
          var pageView = multiview.pageViews[index];
          pageView.view.state.set(state[viewKey]);
          if(_.isFunction(pageView.view.redraw) && pageView.id === 'graph'){
            setTimeout(pageView.view.redraw, 0);
          } else if(pageView.id === 'grid') {
            pageView.view.render();
          }
        });
      } else {
        multiview.updateNav('grid');
      }
    },
    stateChange: function(){
      var id = multiview.state.get('currentView');
      multiview.pager.render();
      if(id === 'graph' || id === 'map') {
        var index = getCurrentViewIndex();
        var menuMap = {graph:'editor', map:'menu'};
        var menuName = menuMap[id];
        var menu = multiview.pageViews[index].view[menuName];
        var viewState = getCurrentView().view.state;
        menu.state.set(viewState.attributes);
        menu.render();
      }
    },
    listenTo: [multiview.state, multiview.model],
    ignoredKeys: ['dataset']
  });



  /**
   * Gets the current displayed view of the multiview.
   * @return {Object}
   */
  function getCurrentView(){
    var id = multiview.state.get('currentView');
    return _.findWhere(multiview.pageViews, {id:id});
  }

  /**
   * Gets the index of current displayed view.
   * @return {[Integer]}
   */
   function getCurrentViewIndex(){
    var id = multiview.state.get('currentView');
    var index;
    _.each(multiview.pageViews, function(item, i){
      if(item.id === id){
        index = i;
      }
    });
    return index;
  }


  // last, we'll demonstrate binding to changes in the dataset
  // this will print out a summary of each change onto the page in the
  // changelog section
  dataset.records.bind('all', function(name, obj) {
    var $info = $('<div />');
    $info.html(name + ': ' + JSON.stringify(obj.toJSON()));
    $('.changelog').append($info);
    $('.changelog').show();
  });
});