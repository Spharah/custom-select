(function(){
    'use strict';
    angular.module('app').config(config);
    
    config.$inject =['customSelectConfigProvider'];
    
    function config(customSelectConfigProvider){
        customSelectConfigProvider.setPlaceholder('Please select');
        customSelectConfigProvider.setSearchLabel('Search name');
       // customSelectConfigProvider.setTemplateUrl('select.html'); 


//      inputRollbackConfigProvider.setRollbackEvent('A');
//      inputRollbackConfigProvider.setResetRollbackEvent('v');   
    }
})()