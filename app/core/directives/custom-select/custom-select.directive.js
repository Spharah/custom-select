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
                        
            ngModel.$formatters.push(function(value) {
                if(value !== undefined){   
                    scope.placeholder = value[scope.displayName];
                    ngModel.$setViewValue(value);  
                    ngModel.$setPristine();
                    return value;
                }                   
            });
           
            scope.setSelectedOption = function(selected) {    
                scope.placeholder = selected.option[scope.displayName];
                ngModel.$setViewValue(selected.option);
                ngModel.$setDirty();
                ngModel.$setTouched();
            }
        }        
    }
})()