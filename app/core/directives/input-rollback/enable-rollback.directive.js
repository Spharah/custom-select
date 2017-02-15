(function(){
'use strict';

    angular
        .module('app.core')
        .directive('inputRollback', inputRollback);
    
    inputRollback.$inject = [];
    
    function inputRollback(){
        var directive = {
            restrict :'A',
            require:'ngModel',
            scope:{rollBackEvent:'@'},
            link:link
        };
        return directive;
        
        function link(scope, elem, attr, ngModel){                          
            var lastCommittedValue;
            
            // set last committed value to a variable
            elem.bind('focus', function(event){
                lastCommittedValue = ngModel.$modelValue;
            });

            // revert value to previous value
            scope.$on(scope.rollBackEvent, function(ev, args) {
                if(lastCommittedValue === undefined)
                    return;
                
               ngModel.$setViewValue(lastCommittedValue, false);
               ngModel.$rollbackViewValue();
               lastCommittedValue = undefined;                              
            });
        }
    }
})()