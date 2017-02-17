(function(){
    angular.module('app.core').provider('inputRollbackConfig', inputRollbackConfig);
    
    function inputRollbackConfig(){
        this.rollbackEvent = 'rollbackValue';
        this.resetRollbackEvent = 'resetLastCommittedValue';
        
        this.$get = function(){            
            var rollbackEvent = this.rollbackEvent;
            var resetRollbackEvent = this.resetRollbackEvent;
            
            return {
                getRollbackEvent:function(name){
                    return rollbackEvent;
                },
                getResetRollbackEvent:function(name){
                    return resetRollbackEvent;
                }               
            }
        }
        
        this.setRollbackEvent = function(rollbackEvent){
            this.rollbackEvent = rollbackEvent;
        }
            
        this.setResetRollbackEvent = function(resetRollbackEvent){
            this.resetRollbackEvent = resetRollbackEvent;
        }       
    }
})()