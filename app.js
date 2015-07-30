(function(angular, moment, undefined) {
    'use strict';
    angular.module('app', ['ng', 'app.ds', 'app.ctrl']);
    angular.module('app.ds', ['ngResource', 'ngSanitize', 'app.lib']);
    angular.module('app.lib', []);
    angular.module('app.ctrl', ['app.index']);
    angular.module('app.index', []);

    angular.module('app')
        .run([ function() {

        }])
    ;

    angular.module('app.lib')
        .value('$moment', moment);
})(angular, moment);