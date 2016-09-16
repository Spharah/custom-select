(function () {
    'use strict';
    angular.module('app.core', []);
})()
;(function(){
    'use strict';
     angular.module('app.core').directive('customSelect',customSelect);    
    customSelect.$inject =['customSelectConfig', '$log', '$parse'];    
    function customSelect(customSelectConfig, log, $parse){
                
        //create instance of the directive
        var directive = {
            template:'<div ng-include="templateUrl"></div>',
            require:'ngModel',
            restrict:'AE',
            scope:{
                searchLabel:'@',
                placeholder :'@',
                options:'=',
                displayName:'@',
                disabled:'=',
                templateUrl:'@'
            },
            link:link
        }
        return directive;
        
        function link(scope, el, attr, ngModel){ 
            if(scope.placeholder === null || scope.placeholder === undefined)
                scope.placeholder = customSelectConfig.placeholder();

            if(scope.searchLabel === null || scope.searchLabel === undefined)                
                scope.searchLabel = customSelectConfig.searchLabel();
            
            if(scope.templateUrl === null || scope.templateUrl === undefined)                
                scope.templateUrl = customSelectConfig.templateUrl();
                        
            ngModel.$formatters.push(function(value){
                if(value !== undefined)
                    scope.placeholder = value[scope.displayName];
            });
           
            scope.setSelectedOption = function(selected){                
                ngModel.$setViewValue(selected.option);
                scope.placeholder = selected.option[scope.displayName];
            }
        }        
    }
})()
;(function(){
    'use strict';
    angular.module('app.core').filter('selectFilter', selectFilter);      
    function selectFilter(){        
        return function(data, key, value){
            if(data.length <= 0) return;
        
            if(key === undefined || value === undefined) return data;

            var options = [];  
            value = angular.lowercase(value);
            for(var i = 0; i < data.length; i++){
                if(data[i][key].toLowerCase().indexOf(value) !== -1)
                    options.push(data[i]);
            }        
            return options;
        };
    }  
})()
;(function(){
    angular.module('app.core').provider('customSelectConfig',customSelectConfig);
    function customSelectConfig(){
        this.placeholder = 'Please select';
        this.searchLabel = 'Search here';
        this.templateUrl = 'core.tpl.custom-select.html';
        
        this.$get = function(){            
            var placeholder = this.placeholder;
            var searchLabel = this.searchLabel; 
            var templateUrl = this.templateUrl;
            
            return {
                placeholder:function(name){
                    return placeholder;
                },
                searchLabel:function(name){
                    return searchLabel;
                },
                templateUrl:function(name){
                    return templateUrl;
                }                
            }
        }
        
        this.setPlaceholder = function(placeholder){
            this.placeholder = placeholder;
        }
            
        this.setSearchLabel = function(searchLabel){
            this.searchLabel = searchLabel;
        }
        
        this.setTemplateUrl = function(templateUrl){
            this.templateUrl = templateUrl;
        }
    }
})()
;(function(){
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
;angular.module('app.core').run(['$templateCache', function($templateCache) {$templateCache.put('core.tpl.custom-select.html','<div class="btn-group">\r\n    <button \r\n            class="btn btn-default dropdown-toggle"\r\n            type="button"\r\n            data-toggle="dropdown"\r\n            aria-haspopup="true"\r\n            aria-expanded="false"\r\n            ng-disabled="disabled"\r\n            >{{placeholder}}\r\n        <span class="fa fa-angle-down pull-right"></span>\r\n    </button>\r\n<div class="dropdown-menu">\r\n    <input type="search" class="form-control" ng-model="searchFilter" placeholder="{{searchLabel}}">\r\n    <ul>        \r\n        <li ng-repeat="option in options | selectFilter : displayName : searchFilter"\r\n            ng-click="setSelectedOption(this)"\r\n            ng-class="option[displayName] == placeholder ? \'selected\' : null">{{option[displayName]}}\r\n        </li>        \r\n    </ul>\r\n    <span ng-show="options.length == 0">No records found...</span>\r\n    </div>    \r\n</div>\r\n');}]);