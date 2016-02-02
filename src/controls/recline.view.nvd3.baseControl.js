/*jshint multistr:true */
this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {
'use strict';

my.BaseControl = Backbone.View.extend({
  template: '<div id="control-chart-container">' +
              '<div class="recline-nvd3-query-editor"></div>' +
              '<div class="form-group">' +
                '<label for="control-chart-x-format">X-Format</label>' +
                '<input value="{{xFormat}}" type="text" id="control-chart-x-format" class="form-control" placeholder="e.g: %Y"/>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-label-x-rotation">Label X Rotation</label>' +
                '<input value="{{options.xAxis.rotateLabels}}" type="text" id="control-chart-label-x-rotation" class="form-control" placeholder="e.g: -45"/>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-transition-time">Transition Time (milliseconds)</label>' +
                '<input value="{{transitionTime}}" type="text" id="control-chart-transition-time" class="form-control" placeholder="e.g: 2000"/>' +
              '</div>' +
              '<div class="form-group">' +
                  
                  '<label for="control-chart-color-picker">Color</label>' +
                  '<input type="text" class="form-control" id="control-chart-color-picker"/>' +
                  '<input class="form-control" type="text" id="control-chart-color" value="{{options.color}}" placeholder="e.g: #FF0000,green,blue,#00FF00"/>' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-x-axis-label">X Axis Label</label>' +
                  '<input class="form-control" type="text" id="control-chart-x-axis-label" value="{{options.xAxis.axisLabel}}"/>' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-x-axis-label">Y Axis Label</label>' +
                  '<input class="form-control" type="text" id="control-chart-y-axis-label" value="{{options.yAxis.axisLabel}}"/>' +
              '</div>' +
              '<div class="form-group">' +
                  '<label for="control-chart-y-axis-label-distance">Y Axis Label Distance</label>' +
                  '<input class="form-control" type="text" id="control-chart-y-axis-label-distance" value="{{options.yAxis.axisLabelDistance}}"/>' +
              '</div>' +
              '<div class="form-group">' +
                '<label for="control-chart-sort">Sort</label>' +
                '<select id="control-chart-sort" class="form-control chosen-select">' +
                  '{{#sortFields}}' +
                    '<option value="{{value}}" {{#selected}} selected{{/selected}}>{{name}}</option>' +
                  '{{/sortFields}}' +
                '</select>' +
              '</div>' +
              '<div class="form-group">' +
                '<div class="row">' +
                  '<div class="col-md-12 col-sm-12">' +
                    '<label for="exampleInputPassword1">Margin</label>' +
                  '</div>' +
                '</div>' +
                '<div class="row">' +
                  '<div class="col-md-3 col-sm-3">' +
                    '<input id="control-chart-margin-top" type="text" class="form-control" aria-label="" placeholder="Top" value="{{options.margin.top}}">' +
                  '</div>' +
                  '<div class="col-md-3 col-sm-3">' +
                    '<input id="control-chart-margin-right" type="text" class="form-control" aria-label="" placeholder="Right" value="{{options.margin.right}}">' +
                  '</div>' +
                  '<div class="col-md-3 col-sm-3">' +
                    '<input id="control-chart-margin-bottom" type="text" class="form-control" aria-label="" placeholder="Bottom" value="{{options.margin.bottom}}">' +
                  '</div>' +
                  '<div class="col-md-3 col-sm-3">' +
                    '<input id="control-chart-margin-left" type="text" class="form-control" aria-label="" placeholder="Left" value="{{options.margin.left}}">' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-title">' +
                  '<input type="checkbox" id="control-chart-show-title" value="{{showTitle}}" {{#showTitle}}checked{{/showTitle}}/> Show title' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-controls">' +
                  '<input type="checkbox" id="control-chart-show-controls" value="{{options.showControls}}" {{#options.showControls}}checked{{/options.showControls}}/> Show controls' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-legend">' +
                  '<input type="checkbox" id="control-chart-show-legend" value="{{options.showLegend}}" {{#options.showLegend}}checked{{/options.showLegend}}/> Show legend' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-group">' +
                  '<input type="checkbox" id="control-chart-group" value="{{group}}" {{#group}}checked{{/group}}/> Group by X-Field' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-tooltips">' +
                  '<input type="checkbox" id="control-chart-show-tooltips" {{#options.tooltips}}checked{{/options.tooltips}}/> Show Tooltips' +
                '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-reduce-ticks">' +
                  '<input type="checkbox" id="control-chart-reduce-ticks" {{#options.reduceXTicks}}checked{{/options.reduceXTicks}}/> Reduce Ticks' +
                '</label>' +
              '</div>' +
            '</div>',

  initialize: function(options){
    var self = this;
    self.state = options.state;
    self.model = options.model;
    self.parent = options.parent;
  },
  events: {
    'change input[type="checkbox"]': 'update',
    'change select': 'update',
    'blur input[type="text"]': 'update',
    'keydown input[type="text"]': 'update',
    'submit #control-chart': 'update'
  },
  render: function(){
    var self = this;
    var sortFields = _.arrayToOptions(_.getFields(self.state.get('model')));
    sortFields.unshift({name:'default', label:'Default', selected: false});
    self.state.set('sortFields', _.applyOption(sortFields, [self.state.get('sort')]));

    var options = self.state.get('options');
    options.margin = options.margin || {top: 15, right: 10, bottom: 50, left: 60};
    self.state.set('options', options);

    self.$el.html(Mustache.render(self.template, self.state.toJSON()));
    self.$('.chosen-select').chosen({width: '95%'});
    $('#control-chart-color').on('blur', function (e) {
      self.update(e);
    });
    $('#control-chart-color-picker').spectrum({
      change : function (color) {
        $('#control-chart-color').val(function (i, val) {
          var newVal;
          if (val) { newVal = val + ', ' + color.toHexString(); }
          else { newVal = color.toHexString(); }
          return newVal;
        });
        $('input#control-chart-color').trigger('blur');
      }
    });
    self.renderQueryEditor();
  },
  renderQueryEditor : function () {
    console.log('QE1', this);
    this.queryEditor = new my.QueryEditor({
      el : '.recline-nvd3-query-editor',
      model: this.model.queryState,
      state: this.state
    });
    this.queryEditor.render();
  },
  update: function(e){
    var self = this;
    var newState = {};
    if (e) {
      if(self.$(e.target).closest('.chosen-container').length) return;
      if(e.type === 'keydown' && e.keyCode !== 13) return;
    }
    newState = _.merge({}, self.state.toJSON(), self.getUIState());
    self.state.set(newState);
  },
  getUIState: function(){
    var self = this;
    var color;

    var computedState = {
      group: self.$('#control-chart-group').is(':checked'),
      transitionTime: self.$('#control-chart-transition-time').val(),
      xFormat: self.$('#control-chart-x-format').val(),
      sort: self.$('#control-chart-sort').val(),
      showTitle: self.$('#control-chart-show-title').is(':checked')
    };

    computedState.options = computedState.options || {};
    computedState.options.xAxis = computedState.options.xAxis || {};
    computedState.options.yAxis = computedState.options.yAxis || {};
    computedState.options.tooltips = self.$('#control-chart-show-tooltips').is(':checked');
    computedState.options.showControls = self.$('#control-chart-show-controls').is(':checked');
    computedState.options.showLegend = self.$('#control-chart-show-legend').is(':checked');
    computedState.options.reduceXTicks = self.$('#control-chart-reduce-ticks').is(':checked');
    computedState.options.xAxis.rotateLabels = self.$('#control-chart-label-x-rotation').val();
    color = _.invoke(self.$('#control-chart-color').val().split(','), 'trim');
    computedState.options.xAxis.axisLabel = self.$('#control-chart-x-axis-label').val();
    computedState.options.yAxis.axisLabel = self.$('#control-chart-y-axis-label').val();
    computedState.options.yAxis.axisLabelDistance = parseInt(self.$('#control-chart-y-axis-label-distance').val()) || 0;
    if(self.$('#control-chart-color').val()){
      computedState.options.color = color;
    } else {
      if(computedState.options.color){
        delete computedState.options.color;
      }
    }
    var margin = {
      top: parseInt(self.$('#control-chart-margin-top').val()),
      right: parseInt(self.$('#control-chart-margin-right').val()),
      bottom: parseInt(self.$('#control-chart-margin-bottom').val()),
      left: parseInt(self.$('#control-chart-margin-left').val()),
    };
    computedState.options.margin = margin;
    return computedState;
  }
});

my.QueryEditor = Backbone.View.extend({
    template: ' \
      <form action="" method="GET" class="form-inline" role="form"> \
        <div class="form-group"> \
          <div class="input-group text-query"> \
            <div class="input-group-btn"> \
              <button type="button" class="btn btn-default">Go &raquo;</button> \
            </div> \
            <input class="form-control search-query" type="text" name="q" value="{{q}}" placeholder="Search data ..."> \
          </div> \
        </div> \
      </form> \
    ',

    events: {
      'click button': 'onFormSubmit',
      'change input': 'onFormSubmit'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.listenTo(this.model, 'change', this.render);
      this.render();
    },
    onFormSubmit: function(e) {
      e.preventDefault();
      var query = this.$el.find('.search-query').val();
      this.model.set({q: query});
    },
    render: function() {
      console.log('QE3', this.$el);
      var tmplData = this.model.toJSON();
      console.log('QE4', tmplData);
      var templated = Mustache.render(this.template, tmplData);
      console.log('QE5.', templated);
      this.$el.html(templated);
    }
  });

  my.FilterEditor = Backbone.View.extend({
    className: 'recline-filter-editor well',
    template: ' \
      <div class="filters"> \
        <div class="form-stacked js-add"> \
          <div class="form-group"> \
            <label>Field</label> \
            <select class="fields form-control"> \
              {{#fields}} \
              <option value="{{id}}">{{label}}</option> \
              {{/fields}} \
            </select> \
          </div> \
          <div class="form-group"> \
            <label>Filter type</label> \
            <select class="filterType form-control"> \
              <option value="term">Value</option> \
              <option value="range">Range</option> \
              <option value="geo_distance">Geo distance</option> \
            </select> \
          </div> \
          <button id="add-filter-btn" type="button" class="btn btn-default">Add</button> \
        </div> \
        <div class="form-stacked js-edit"> \
          {{#filters}} \
            {{{filterRender}}} \
          {{/filters}} \
          {{#filters.length}} \
          <button type="button" class="btn btn-default">Update</button> \
          {{/filters.length}} \
        </div> \
      </div> \
    ',
    filterTemplates: {
      term: ' \
        <div class="filter-{{type}} filter"> \
          <div class="form-group"> \
            <label> \
              {{field}} <small>{{type}}</small> \
              <a class="js-remove-filter" href="#" title="Remove this filter" data-filter-id="{{id}}">&times;</a> \
            </label> \
            <input class="form-control" type="text" value="{{term}}" name="term" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
          </div> \
        </div> \
      ',
      range: ' \
        <div class="filter-{{type}} filter"> \
          <fieldset> \
            <div class="form-group"> \
              <label> \
                {{field}} <small>{{type}}</small> \
                <a class="js-remove-filter" href="#" title="Remove this filter" data-filter-id="{{id}}">&times;</a> \
              </label> \
            </div> \
            <div class="form-group"> \
              <label for="">From</label> \
              <input class="form-control" type="text" value="{{from}}" name="from" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
            </div> \
            <div class="form-group"> \
              <label for="">To</label> \
              <input class="form-control" type="text" value="{{to}}" name="to" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
            </div> \
          </fieldset> \
        </div> \
      ',
      geo_distance: ' \
        <div class="filter-{{type}} filter"> \
          <fieldset> \
            <legend> \
              {{field}} <small>{{type}}</small> \
              <a class="js-remove-filter" href="#" title="Remove this filter" data-filter-id="{{id}}">&times;</a> \
            </legend> \
            <div class="form-group"> \
              <label class="control-label" for="">Longitude</label> \
              <input class="input-sm" type="text" value="{{point.lon}}" name="lon" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
            </div> \
            <div class="form-group"> \
              <label class="control-label" for="">Latitude</label> \
              <input class="input-sm" type="text" value="{{point.lat}}" name="lat" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
            </div> \
            <div class="form-group"> \
              <label class="control-label" for="">Distance (km)</label> \
              <input class="input-sm" type="text" value="{{distance}}" name="distance" data-filter-field="{{field}}" data-filter-id="{{id}}" data-filter-type="{{type}}" /> \
            </div> \
          </fieldset> \
        </div> \
      '
    },
    events: {
      'click .js-remove-filter': 'onRemoveFilter',
      'click .js-add-filter': 'onAddFilterShow',
      'click .js-edit button': 'onTermFiltersUpdate',
      'click #add-filter-btn': 'onAddFilter'
    },
    initialize: function() {
      _.bindAll(this, 'render');
      this.listenTo(this.model.fields, 'all', this.render);
      this.listenTo(this.model.queryState, 'change change:filters:new-blank', this.render);
      this.render();
    },
    render: function() {
      var self = this;
      var tmplData = $.extend(true, {}, this.model.queryState.toJSON());
      // we will use idx in list as there id ...
      tmplData.filters = _.map(tmplData.filters, function(filter, idx) {
        filter.id = idx;
        return filter;
      });
      tmplData.fields = this.model.fields.toJSON();
      tmplData.filterRender = function() {
        return Mustache.render(self.filterTemplates[this.type], this);
      };
      var out = Mustache.render(this.template, tmplData);
      this.$el.html(out);
    },
    onAddFilterShow: function(e) {
      e.preventDefault();
      var $target = $(e.target);
      $target.hide();
      this.$el.find('.js-add').show();
    },
    onAddFilter: function(e) {
      e.preventDefault();
      var $target = $(e.target).closest('.form-stacked');
      $target.hide();
      var filterType = $target.find('select.filterType').val();
      var field      = $target.find('select.fields').val();
      this.model.queryState.addFilter({type: filterType, field: field});
    },
    onRemoveFilter: function(e) {
      e.preventDefault();
      var $target = $(e.target);
      var filterId = $target.attr('data-filter-id');
      this.model.queryState.removeFilter(filterId);
    },
    onTermFiltersUpdate: function(e) {
     var self = this;
      e.preventDefault();
      var filters = self.model.queryState.get('filters');
      var $form = $(e.target).closest('.form-stacked');
      _.each($form.find('input'), function(input) {
        var $input = $(input);
        var filterType  = $input.attr('data-filter-type');
        var fieldId     = $input.attr('data-filter-field');
        var filterIndex = parseInt($input.attr('data-filter-id'), 10);
        var name        = $input.attr('name');
        var value       = $input.val();

        switch (filterType) {
          case 'term':
            filters[filterIndex].term = value;
            break;
          case 'range':
            filters[filterIndex][name] = value;
            break;
          case 'geo_distance':
            if(name === 'distance') {
              filters[filterIndex].distance = parseFloat(value);
            }
            else {
              filters[filterIndex].point[name] = parseFloat(value);
            }
            break;
        }
      });
      self.model.queryState.set({filters: filters, from: 0});
      self.model.queryState.trigger('change');
    }
  });


})(jQuery, recline.View.nvd3);
