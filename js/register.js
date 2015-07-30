(function (angular, crazyLikeAFox, undefined) {
    "use strict";

    var slice = [].slice;
    function sliceArgs (args, offset) {
        return slice.call(args, offset || 0);
    }

    function RegisterModelFactory () {
        return function BuildRegisterModel() {
            var subscriberArr = [];

            return {
                run: function run() {
                    var args = sliceArgs(arguments);
                    return subscriberArr.map(function runner(func) {
                        return func.apply(null, args);
                    });
                },
                runSilent: function runSilent() {
                    var args = sliceArgs(arguments);
                    subscriberArr.forEach(function runner(func) {
                        func.apply(null, args);
                    });
                },
                register: function register(func) {
                    if (typeof func === 'function') {
                        subscriberArr.push(func);
                    } else {
                        return Function.prototype;
                    }

                    return function unregister() {
                        var index;
                        if (~(index = subscriberArr.indexOf(func))) {
                            subscriberArr.splice(index, 1);
                        }
                    };
                }
            };
        };
    }

    function PubSub(Register) {
        this.$inject = ['Register'];

        var channelMap = {};

        function openChannel(channel) {
            channelMap[channel] = channelMap[channel] || Register();
            return channelMap[channel];
        }

        return {
            subscribe: function subscribe(channel, callback) {
                var unregister = openChannel(channel).register(callback);

                return function unsubscribe() {
                    unregister();
                }
            },
            /**
             *
             * @param {string} channel
             * @param {[...]} arguments
             */
            publish: function publish(channel) {
                var args = sliceArgs(arguments, 1);
                openChannel(channel).runSilent(args);
            }
        };
    }

    crazyLikeAFox.BuildSubscriberModel = RegisterModelFactory();
    if (angular) {
        angular.module('clvf').factory('Register', RegisterModelFactory).factory('PubSub', PubSub);
    }
})(window.angular, clvf);