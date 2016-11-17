(function () {
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
                         return e[scope.displayValue] == selected.option[scope.displayValue];
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