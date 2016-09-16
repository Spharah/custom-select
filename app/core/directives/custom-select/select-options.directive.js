(function(){
'use strict';
    angular.module('app.core').directive('selectOptions', selectOptions);    
    selectOptions.$inject = ['$log', '$compile', '$parse'];
    
    function selectOptions($log, $compile, $parse){
        var directive ={
            restrict:'A',
            terminal:true,
            link:link
        }
        return directive;
        
        function link(scope, el, attr, ngModel){
            
            //comprehension_expression
            
            var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
            var expression  = attr.selectOptions;
           
            
            var match = expression.match(NG_OPTIONS_REGEXP);
            if (!(match)) {
      throw ('invalid expression : '+ expression + ' in ');
    }
          
            // Extract the parts from the ngOptions expression

    // The variable name for the value of the item in the collection
    var valueName = match[5] || match[7]; 
            
    // The variable name for the key of the item in the collection
    var keyName = match[6];  

    // An expression that generates the viewValue for an option if there is a label expression
    var selectAs = / as /.test(match[0]) && match[1];
            
    // An expression that is used to track the id of each object in the options collection
    var trackBy = match[9];
            
    // An expression that generates the viewValue for an option if there is no label expression
    var valueFn = $parse(match[2] ? match[1] : valueName);
    var selectAsFn = selectAs && $parse(selectAs);  
    var viewValueFn = selectAsFn || valueFn;  
    var trackByFn = trackBy && $parse(trackBy); 

    // Get the value by which we are going to track the option
    // if we have a trackFn then use that (passing scope and locals)
    // otherwise just hash the given viewValue
    var getTrackByValueFn = trackBy ?
                              function(value, locals) { return trackByFn(scope, locals); } :
                              function getHashOfValue(value) { return hashKey(value); };
    var getTrackByValue = function(value, key) {
      return getTrackByValueFn(value, getLocals(value, key));
    };

    var displayFn = $parse(match[2] || match[1]); 
    var groupByFn = $parse(match[3] || ''); 
    var disableWhenFn = $parse(match[4] || ''); 
    var valuesFn = $parse(match[8]);  

    var locals = {};
    var getLocals = keyName ? function(value, key) {
      locals[keyName] = key;
      locals[valueName] = value;
      return locals;
    } : function(value) {
      locals[valueName] = value;
      return locals;
    };    
            
        }
    }
})()