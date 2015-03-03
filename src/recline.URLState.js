/*jshint multistr:true*/

this.recline = this.recline || {};

;(function($, my) {
  'use strict';

  /**
   * Router object
   * @param {recline.ObjectState} state
   * @param {Object} first
   */
  my.URLState = function(options){
    var self = this;
    var parser;
    var dependencies = {};
    var router;
    self.currentState = {};

    options = options || {};
    if(options.parser) {
      parser = new options.parser();
    } else {
      parser = new my.Parser();
    }


    function inv(method){
      var args = _.rest(_.toArray(arguments));
      return function(ctrl){
        return _.isFunction(ctrl[method]) && ctrl[method].apply(ctrl, args);
      };
    }

    /**
     * Init first state
     * @param  {[String]} serializedState Url serialized state
     */
    self._init = function(serializedState){
      var state = self.transform(serializedState, self.toState);
      _.each(dependencies, inv('update', state));
      self.currentState = state;
      if(options.init){
        options.init(state);
      }
    };


    /**
     * Adds a dependency to this router. Something to track and
     * to execute when tracked thing changes
     * @param  {Function} ctrl Constructor with the implementation
     * of this observer
     * @return {undefined}
     */
    self.addDependency = function(ctrl){
      dependencies[ctrl.name] = ctrl;
    };


    self.getCurrentState = function(){
      return self.currentState;
    };

    self.getSerializedState = function(state){
      return self.transform(state, self.toParams);
    };
    /**
     * Applies a transform function to the input and return de result.
     * @param  {String} input
     * @param  {Function} transformFunction
     * @return {String}
     */
    self.transform = function(input, transformFunction){
      var result;
      // try{
        result = transformFunction(input);
      // } catch(e){
      //   result = null;
      // }
      return result;
    };

    /**
     * Converts a serialized state string to an object.
     * @param  {String} serializedState
     * @return {Object}
     */
    self.toState = function(serializedState){
      var stringObject = parser.inflate(decodeURI(serializedState));
      return JSON.parse(stringObject);
    };

    /**
     * Converts an object state to a string.
     * @param  {Object} state
     * @return {String}
     */
    self.toParams = function(state){
      var stringObject = JSON.stringify(state);
      return parser.compress(stringObject);
    };

    /**
     * Listen for changes in the state. It computes the differences
     * between the initial state and the current state. Creates a patch object
     * from this difference. Converts this new object to params and finally
     * navigates to that state.
     * @param  {Event} event
     */
    self.navigateToState = function(state){
      self.currentState = state;
      router.navigate(self.transform(state, self.toParams));
      options.stateChange && options.stateChange(state); // jshint ignore:line
    };

    var Router = Backbone.Router.extend({
      routes: {
        '*state': 'defaultRoute',
      },
      defaultRoute: self._init
    });
    router = new Router();
    Backbone.history.start();
  };

  /**
   * Url parser
   */
  my.Parser = function(){
    var self = this;

    /**
     * Reduces the size of the url removing unnecesary characters.
     * @param  {String} str
     * @return {String}
     */
    self.compress = function(str){

      // Replace words
      // Remove start and end brackets
      // Replace true by 1 and false by 0
      return self.escapeStrings(str);
    };

    /**
     * Inflates a compressed url string.
     * @param  {String} str
     * @return {String}
     */
    self.inflate = function(str){
      return self.parseStrings(str);
    };

    /**
     * Escape all the string prepending a ! character to each one.
     * @param  {String} str
     * @return {String}
     */
    self.escapeStrings = function(str){

      // % presence could lead to malformed url.
      str = str.replace('%', '@@');

      // Stripping quotes from keys
      str = str.replace(/"([a-zA-Z-_.]+)"\s?:/g ,  '$1:');

      // Replacing spaces between quotes with underscores
      str = str.replace(/\x20(?![^"]*("[^"]*"[^"]*)*$)/g, '++');
      return str.replace(/"([a-zA-Z0-9-#_.-|+]+)?"/g ,  '!$1');
    };

    /**
     * Converts all escaped strings to javascript strings.
     * @param  {String} str
     * @return {String}
     */
    self.parseStrings = function(str){

      // Converting all the @@ to %.
      str = str.replace('@@', '%');

      // Adding quotes to keys
      str = str.replace(/([{,])([a-zA-Z-_.\+]+)\s?:/g ,  '$1\"$2\":');
      // Replacing underscores with spaces for any word that start with !
      // TODO: make space replacement configurable
      str = str.replace(/![a-zA-Z0-9_. -\+]+/g, function(x) {
        return x.replace(/\+\+/g, ' ');
      });
      return str.replace(new RegExp('!([a-zA-Z0-9-_# .-:%]+)?', 'g'),  '\"$1\"');
    };
  };

})(jQuery, this.recline);