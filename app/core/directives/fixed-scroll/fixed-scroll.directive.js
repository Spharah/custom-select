(function(){
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