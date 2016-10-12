(function(){
    'use strict';
    angular.module('app').controller('MainController', MainController);
    
    MainController.$inject =['$scope'];
    
    function MainController($scope){
        $scope.options = [];        
        for(var i = 1; i <= 15; i++){
            $scope.options.push({value : i, name : 'Item '+i });
        }
        
        $scope.validate =function(){
                console.log(JSON.stringify( $scope.MyOptions2));
        };
        
        $scope.MyOptions2 = $scope.options[5];
         //$scope.original = $scope.options[5];
    }
})()