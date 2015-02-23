_.mixin({
  getFields: function(model){
    var self = this;
    var fields = [];
    try{
      fields = _.pluck(model.fields.toJSON(), 'id');
    } catch(err) {
      console.error('Error retrieving dataset fields');
    }
    return fields;
  },
	applyOption:function(options, selected){
		return _.map(options, function(option, index){
			option.selected = (_.inArray(selected, option.value))? true : false;
			return option;
		});
	},
	arrayToOptions: function(options){
		return _.map(options, function(option){
			return {name:option, value:option, selected: false};
		});
	},
});