(function(){
    'use strict';
    angular
        .module('app.core')
        .directive('inputRollback', inputRollback);
    
    inputRollback.$inject = [];
    
    function inputRollback(){
        
        var directive = {
            restrict: 'A',
            replace:false,
            require:'ngModel',
            link:link
        };
        return directive;
        
        function link(scope, elem, attr, ngModel){
            
            var lastCommittedValue;
            var rollbackListener = attr.rollbackEvent === undefined ? inputRollbackConfig.getRollbackEvent() : attr.rollbackEvent;
            var resetRollbacklistener  = attr.resetRollbackEvent === undefined ? inputRollbackConfig.getResetRollbackEvent() : attr.resetRollbackEvent;
            
            elem.bind('focus',focusEvent); 
            scope.$on(rollbackListener, rollbackEvent);
            scope.$on(resetRollbacklistener, resetRollbackEvent);
              
            // set last committed value to a variable
            function focusEvent(event){
                lastCommittedValue = ngModel.$modelValue;
            }
            
            // revert value to previous value
            function rollbackEvent (ev, args) {
                if(lastCommittedValue === undefined)
                    return;
                
               ngModel.$setViewValue(lastCommittedValue, false);
               ngModel.$rollbackViewValue();
               lastCommittedValue = undefined;                              
            }
            
            // clear last committed value
            function resetRollbackEvent(ev, args){
                if(lastCommittedValue === undefined)
                    return;
                
                lastCommittedValue = undefined;
            }
        }
    }
})()