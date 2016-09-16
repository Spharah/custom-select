(function(){
    angular.module('app.core').provider('customSelectConfig',customSelectConfig);
    function customSelectConfig(){
        this.placeholder = 'Please select';
        this.searchLabel = 'Search here';
        this.templateUrl = 'core.tpl.custom-select.html';
        
        this.$get = function(){            
            var placeholder = this.placeholder;
            var searchLabel = this.searchLabel; 
            var templateUrl = this.templateUrl;
            
            return {
                placeholder:function(name){
                    return placeholder;
                },
                searchLabel:function(name){
                    return searchLabel;
                },
                templateUrl:function(name){
                    return templateUrl;
                }                
            }
        }
        
        this.setPlaceholder = function(placeholder){
            this.placeholder = placeholder;
        }
            
        this.setSearchLabel = function(searchLabel){
            this.searchLabel = searchLabel;
        }
        
        this.setTemplateUrl = function(templateUrl){
            this.templateUrl = templateUrl;
        }
    }
})()