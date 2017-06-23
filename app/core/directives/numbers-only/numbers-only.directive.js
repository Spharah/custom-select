(function () {
    'use strict';
    angular.module('app.core').directive('numbersOnly', numbersOnly);

    numbersOnly.$inject = [];

    function numbersOnly() {
        var directive = {
            restrict: 'A',
            replace: false,
            require: '?ngModel',
            scope: {
                decimalPlace: '=',
                allowNegative: '='
            },
            link: link
        };
        return directive;

        function link(scope, el, attr, ngModel) {
            if (!ngModel)
                throw ('ng-model is requred.');

            ngModel.$parsers.push(function (val) {

                if (angular.isUndefined(val))
                    val = '';

                if (typeof val == "number")
                    val = '' + val;

                var clean;
                switch (scope.allowNegative) {
                    case false:
                        if (scope.decimalPlace === 0)
                            clean = val.replace(/[^0-9]/g, '');
                        else
                            clean = val.replace(/[^0-9\.]/g, '');
                        break;

                    default:
                        if (scope.decimalPlace === 0)
                            clean = val.replace(/[^-0-9]/g, '');
                        else
                            clean = val.replace(/[^-0-9\.]/g, '');
                        break;
                }

                var negativeCheck = clean.split('-');
                var decimalCheck = clean.split('.');

                if (!angular.isUndefined(negativeCheck[1])) {
                    negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                    clean = negativeCheck[0] + '-' + negativeCheck[1];
                    if (negativeCheck[0].length > 0) {
                        clean = negativeCheck[0];
                    }
                }

                if (!angular.isUndefined(decimalCheck[1])) {
                    decimalCheck[1] = decimalCheck[1].slice(0, angular.isUndefined(scope.decimalPlace) ? 2 : scope.decimalPlace);
                    clean = decimalCheck[0] + '.' + decimalCheck[1];
                }

                if (val !== clean) {
                    ngModel.$setViewValue(clean);
                    ngModel.$render();
                }
                return clean;
            });

            // Bind keypress event to the element
            el.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    }
})()