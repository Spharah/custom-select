(function () {
    'use strict';
    angular.module('app.core', []);
})()
;(function () {
    'use strict';
    angular.module('app.core').directive('customSelect', customSelect);
    customSelect.$inject = ['customSelectConfig', '$log', '$parse'];
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
                displayValue:'@',
                disabled:'=',
                templateUrl:'@',
                multiselect:'='
            },
            link:link
        }
        return directive;
        
        function link(scope, el, attr, ngModel){ 
            
            scope.multiselectModel = [];
            
            if(scope.multiselect === undefined) 
                scope.multiselect = false;
            
            if(scope.placeholder === null || scope.placeholder === undefined)
                scope.placeholder = customSelectConfig.placeholder();

            if(scope.searchLabel === null || scope.searchLabel === undefined)                
                scope.searchLabel = customSelectConfig.searchLabel();
            
            if(scope.templateUrl === null || scope.templateUrl === undefined)                
                scope.templateUrl = customSelectConfig.templateUrl();
            
            // Set default value on load
            ngModel.$formatters.push(function(value) {
                if(value !== undefined){   
                    scope.placeholder = value[scope.displayName];
                    ngModel.$setViewValue(value);  
                    ngModel.$setPristine();
                    return value;
                }                   
            });
           
            // Update ngModel and set dity and touched properties
            scope.setSelectedOption = function(selected) {
                if(scope.multiselect) {
                                       
                    // Create query to filter by option value
                    var query = {};
                    query[scope.displayValue] = selected.option[scope.displayValue];
                    
                    // Check if the selected item already exist
                    // Remove it from model if selected else add it to model
                    var index = _.findIndex(scope.multiselectModel, query);      
                    if(index != -1)
                        scope.multiselectModel.splice(index, 1);
                    else
                        scope.multiselectModel.push(selected.option);
                                        
                    // clear placeholder and append selected item to list
                    scope.placeholder = '';                    
                    for(var i = 0; i < scope.multiselectModel.length; i ++)                       
                        scope.placeholder += scope.multiselectModel[i][scope.displayName]+'; ';
                    
                    // set model value
                    ngModel.$setViewValue(scope.multiselectModel);
                        
                }else{
                    
                    // set placeholder
                    scope.placeholder = selected.option[scope.displayName];
                    
                     // set model value
                    ngModel.$setViewValue(selected.option);
                }
                
                // Set touch and dirty value
                ngModel.$setDirty();
                ngModel.$setTouched();
            }
            
            // clear selected items
            scope.clearAll = function() {
                scope.multiselectModel = [];
                scope.placeholder = customSelectConfig.placeholder();                
                ngModel.$setViewValue(undefined);
                ngModel.$setPristine();
                ngModel.$setUntouched();
            }
            
            // select all items
            scope.selectAll = function() {
                scope.multiselectModel = angular.copy(scope.options);
                
                // clear placeholder and append selected item to list
                    scope.placeholder = '';                    
                    for(var i = 0; i < scope.multiselectModel.length; i ++)                       
                        scope.placeholder += scope.multiselectModel[i][scope.displayName]+'; ';
                
                ngModel.$setViewValue(scope.multiselectModel);
                ngModel.$setDirty();
                ngModel.$setTouched();
            }
            
            // Highlight the selected item
            scope.isSelected = function(selected) {
                
                if(scope.multiselect) {                    
                    var item = $.grep(scope.multiselectModel, function(e){
                        return e.value == selected.option.value;
                    });
                
                    if(item.length === 0)
                        return false;

                    return true;                    
                } else {
                    
                   if(selected.option[scope.displayName] === scope.placeholder)
                       return true;
                    else
                        return false;                    
                }                    
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
   
       var options = scope.$eval(match[8]);
        angular.forEach(options,function( item){    
           console.log(item)
       })    
     
    
            
        
          
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
;(function(){
    'use strict';
    
    angular.module('app.core').directive('fixedScroll', fixedScroll);
    
    fixedScroll.$inject = [];
    
    function fixedScroll(){
        var directive = {
            restrict:'E',
            templateUrl:"core.tpl.fixed-scroll.html",
            scope:{
                position:'=',
                containerId:'@',
                elementId:'@'
            },
            link:link
        };
        return directive;
        
        function link(scope, elem, attr, ctrl) {            
            angular.element(document).ready(function() {
            
            //Get the element 
            var targetContainer = angular.element(document.querySelector('#'+scope.containerId ));
            var targetElement = angular.element(document.querySelector('#'+scope.elementId ));
            var scrollContainer = elem.find('.fixed-scroll-container');
            var scroll = elem.find('.fixed-scroll');

            scrollContainer.css('width', targetContainer.width()+'px');
            scroll.css('width', targetElement.width()+'px');
                        
            // scroll the target element when the fixed scroll bar is scrolled
            scrollContainer.on('scroll', function(){
                  targetContainer.scrollLeft($(this).scrollLeft());
              });  
               
            //Watch and update scroll width when table width changes    
            scope.$watch(function () {
                return targetElement.width(); 
            }, function (nv, ov) {
                    if (nv != ov) {
                        scroll.css('width', nv + 'px');                        
                    }
                });
                
            //Watch and update scroll width when table container width changes      
            scope.$watch(function(){
                return targetContainer.width();
            },function(nv, ov){
                if(nv != ov){
                     scrollContainer.css('width', nv + 'px');
                }                
            });
            
            }) 
        }
    }    
})()
;(function () {
    'use strict';
    angular.module('app.core').directive('numbersOnly', numbersOnly);
    
    numbersOnly.$inject = [];
    
    function numbersOnly(){
        var directive ={            
            require: '?ngModel',
            scope:{decimalPlace:'='},
            link:link 
        };
        return directive;
        
        function link(scope, el, attr, ngModel){
            if(!ngModel)
                throw('ng-model is requred.');
            
            ngModel.$parsers.push(function(val) {
                
            if (angular.isUndefined(val))
                val = '';
         
            var clean = val.replace(/[^-0-9\.]/g, '');
            var negativeCheck = clean.split('-');
			var decimalCheck = clean.split('.');
                
            if(!angular.isUndefined(negativeCheck[1])) {
                negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                clean = negativeCheck[0] + '-' + negativeCheck[1];
                if(negativeCheck[0].length > 0) {
                	clean = negativeCheck[0];
                }                
            }
                
            if(!angular.isUndefined(decimalCheck[1])) {
                decimalCheck[1] = decimalCheck[1].slice(0, angular.isUndefined(scope.decimalPlace) ? 2 : scope.decimalPlace);
                clean = decimalCheck[0] + '.' + decimalCheck[1];
            }

                if (val !== clean) {
                  ngModel.$setViewValue(clean);
                  ngModel.$render();
                }
                return clean;            
            });
            
            // Bind keypress event to the element
            el.bind('keypress', function(event) {
            if(event.keyCode === 32) {
                  event.preventDefault();
                }
             });                      
        }
    }
})()
;angular.module('app.core').run(['$templateCache', function($templateCache) {$templateCache.put('core.tpl.custom-select.html','<div class="btn-group">\r\n    <button \r\n            class="btn btn-default dropdown-toggle"\r\n            type="button"\r\n            data-toggle="dropdown"\r\n            aria-haspopup="true"\r\n            aria-expanded="false"\r\n            ng-disabled="disabled"\r\n            >{{placeholder}}\r\n        <span class="fa fa-angle-down pull-right"></span>\r\n    </button>\r\n<div class="dropdown-menu" ng-click="multiselect ? $event.stopPropagation() : null">\r\n    <input type="search" class="form-control" ng-model="searchFilter" placeholder="{{searchLabel}}">\r\n    <ul>        \r\n        <li ng-repeat="option in options | selectFilter : displayName : searchFilter"\r\n            ng-click="setSelectedOption(this)"\r\n            ng-class="isSelected(this) ? \'selected\' : null"> {{option[displayName]}}\r\n        </li>         \r\n    </ul>\r\n    <hr ng-if="multiselect"/>\r\n<!--    <span ng-show="options.length == 0">No records found...</span>-->\r\n        <div class="col-md-1" ng-show="multiselect">\r\n            <span class="clickable" ng-click="selectAll()"><i class="fa fa-check-circle" aria-hidden="true"></i> Select all</span> &nbsp;&nbsp;\r\n            <span class="clickable" ng-click="clearAll()"><i class="fa fa-times-circle" aria-hidden="true"></i> Clear all</span>\r\n        </div>\r\n        \r\n    </div>    \r\n</div>\r\n');
$templateCache.put('core.tpl.fixed-scroll.html','<div class="fixed-scroll-container" style="overflow:auto; position:fixed;bottom:0">\r\n    <div class="fixed-scroll">&nbsp;</div>\r\n</div>');}]);