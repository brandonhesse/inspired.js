(function (angular, undefined) {
    'use strict';
    var ds = angular.module('app.ds');

    function isInvokable(callable) {
        if (angular.isFunction(callable) && !Array.isArray(callable.$inject)) {
            throw new Error('Function does not have a $inject array internally.');
        }
        return !!(angular.isFunction(callable) || (Array.isArray(callable) && angular.isFunction(callable[callable.length - 1])));
    }

    function abstractedController(config) {
        // Abstract controller takes an object as an argument, it's "configuration"
        // At the start of control invocation
        return ['$scope', '$injector', function controller($scope, $injector) {
            // Configuration phase
            var locals = {
                $scope: $scope,
                parent: $scope[config.parentCtrlAs] || {},
                internals: {}
            };
            var hasSetup = isInvokable(config.setup),
                hasWatcher = isInvokable(config.watcherFn),
                hasLoader = isInvokable(config.load);
            var deconstructors = [
                $scope.$on('$destroy', function () {
                    deconstructors.forEach(function (deconstructor) {
                        deconstructor();
                    });
                })
            ];

            $scope.d1 = config.d1 || [];

            // Behaviors
            $scope.switchCarousel = carouselBuilder('featured');

            // Load Behaviors
            if (hasLoader) {
                $scope.edit = function edit(record) {
                    $injector.invoke(config.load, this, angular.extend({}, locals, { record: record }));
                };
            } else {
                $scope.edit = function edit(record) {
                    $scope.recordCopy = angular.copy(record);
                }
            }

            // Setup Phase
            if (hasSetup) {
                $injector.invoke(config.setup, this, locals);
            }

            // Watchers (after setup)
            if (hasWatcher) {
                $injector.invoke(config.watcherFn, this, angular.extend({
                    deconstructors: deconstructors
                }, locals));
            }
        }];
    }

    ds.controller('CardCtrl', abstractedController({
        d1: [
            { key1: 'a', value: 4 },
            { key1: 'b', value: 5 },
            { key1: 'c', value: 6 }
        ],
        setup: ['$scope', '$log', function ($scope, $log) {

        }]
    }));

    ds.controller('VideoCtrl', abstractedController({
        d1: [
            { key1: 'a', value: 1 },
            { key1: 'b', value: 2 },
            { key1: 'c', value: 3 }
        ],
        setup: ['$scope', '$log', function ($scope, $log) {
            $scope.d1.push({key1: 'd', value: 4});
        }]
    }));

    ds.controller('GameCtrl', abstractedController({

        setup: ['$scope', '$log', function ($scope, $log) {

        }]
    }));

    ds.controller('ProductCtrl', abstractedController({

        setup: ['$scope', '$log', function ($scope, $log) {

        }]
    }));

    //ds.controller('theBody', abstractedController({
    //    parentCtrlAs: 'theName',
    //    watcherFn: ['$scope', '$log', 'deconstructors', function ($scope, $log, deconstructors) {
    //        deconstructors.push(
    //            $scope.$watch('state', function (newState, oldState) {
    //                if (newState !== undefined || !angular.equals(newState, oldState)) {
    //                    $scope.disable = true;
    //                    $log.warn('You broke it, hero.');
    //                }
    //            })
    //        );
    //    }]
    //}))
})(angular);