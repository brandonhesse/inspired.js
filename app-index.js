(function (angular, undefined) {
    'use strict';
    var index = angular.module('app.index');

    index.controller('IndexCtrl', ['$scope', '$timeout', '$interval', function ($scope, $timeout, $interval) {
        var promise;
        $scope.hello = 'How much do you want?';

        $scope.askFor = function askForMoney(request) {
            $scope.begMore();

            $scope.hello = 'Thinking about it.';
            promise = $interval(function () {
                $scope.hello += '.';
            }, 1000, 10); // After 10 loops, daddy will accept your request, unless you beg harder.

            if (request > 10) {
                $scope.noWay = "I'm not giving you that much.";
                $interval.cancel(promise);
            }

            return promise // Asked for 10 dollars
                .then(
                function gotRequest(money) { // Resolve (gave me 10 dollars)
                    $scope.hello = 'Alright. Don\'t spend it all in one place.';
                    $scope.noWay = `Got ${request} dollars.`;
                },
                function wasToldNo(reason) { // Reject (said no)
                    // I can reattempt! or I can throw more errors.
                    // Reattempt, return a new Promise
                    if (request < 5) { throw new Error('Dad was being stingy!'); }
                    return askForMoney(request / 2);
                    // return null; // Goes down the resolve chain
                    // throw new Error('WHY DADDY WHY!'); // returns a promise

                })
                .then(
                function resolvedLater(args) {
                    console.log(`Resolved on request for ${request} dollars`);
                },
                function wasToldNo(reason) {
                    console.log(`I'm still whining over ${request} dollars!`);
                }
            );
        };

        $scope.begMore = function begMore() {
            if (promise) {
                console.log('Asked for a little much.');
                $interval.cancel(promise);
                promise = undefined;
            }
        }
    }]);
})(angular);

/**
 *
 * Get Names of Friends -> Deferred Task
 *      When I get that list I will (resolve)
 *          Add them to a array
 *          Put that arry into a table
 *          Call them up
 *      When I don't get that list I will (reject)
 *          I will notify I didn't get any list
 *          I will set the array to empty
 *          I will prompt to try again
 *
 *
 *          Pending -> Resolved
 *          Pending -> Rejected
 *
 *
 *
 */