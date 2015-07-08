(function (angular, crazyLikeAFox, undefined) {
    "use strict";

    function BuildSubscriberModel() {
        var subscriberArr = [];

        return {
            run: function run() {
                return subscriberArr.map(function runner(func) {
                    return func();
                });
            },
            runSilent: function runSilent() {
                return subscriberArr.forEach(function runner(func) {
                    func();
                });
            },
            subscribe: function subscribe(func) {
                if (typeof func === 'function') {
                    subscriberArr.push(func);
                } else {
                    return Function.prototype;
                }

                return function unsubscribe() {
                    var index;
                    if (~(index = subscriberArr.indexOf(func))) {
                        subscriberArr.splice(index, 1);
                    }
                };
            }
        };
    }

    crazyLikeAFox.BuildSubscriberModel = BuildSubscriberModel;
    if (angular) {
        angular.module('clvf').factory('BuildSubscriberModel', BuildSubscriberModel);
    }
})(window.angular, clvf);