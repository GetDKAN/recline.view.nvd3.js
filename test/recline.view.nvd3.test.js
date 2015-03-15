(function ($) {

module("View - NVD3");

QUnit.test('initial test', function (assert) {
  var urlSource = 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv';
  var $graphEl = $('#graph');
  var router = new recline.URLState();
  var dataset = Fixture.getDataset();
  window.viewer = new recline.View.nvd3.polimorphic({
    el: $graphEl,
    router: router,
    state: {
      source: urlSource,
      width: 480,
      height: 480,
      sort: "state",
      seriesFields: ["total.forcelosures"],
      currentView: "pieChart"
    },
  });
  var rendered = window.viewer.el.innerHTML;
  assertSelectorPresent('.form-control', rendered);
  assertTextPresent('Chart', rendered);
  assertTextPresent('Source', rendered);
  assertTextPresent('Series', rendered);
});

})(this.jQuery);
