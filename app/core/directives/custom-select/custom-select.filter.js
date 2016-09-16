(function(){
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