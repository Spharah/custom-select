(function(){
    angular.module('app.core').directive('listItemColour', listItemColour);
    
    listItemColour.$inject = [];
    
    function listItemColour(){
        var directive = {
            restrict: 'A',
            link: link,
            scope:{
                colours:'=',
                itemIndex:'='
            }
        };
        return directive;
        
        function link (scope, el, attrs) {
            
           setColour(scope.colours[scope.itemIndex % scope.colours.length]);
            
            function setColour(colour) {
                el[0].style.color = colour;
            }            
        }        
    }
})()