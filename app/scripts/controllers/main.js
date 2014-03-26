'use strict';

angular.module('ccparty')
    .controller('MainCtrl', function ($scope, cast, $timeout, $log) {
        // number of connections
        $scope.connected = 0;
        // number of sessions is the number of connections, but isn't decreased on disconnect
        // to detect failures
        $scope.sessionCount = 0;
        $scope.messages = [];

        var idleTimeout = function idle() {
            if ($scope.connected == 0) {
                cast.finish();
            }
        };

        var idlePromise;
        var receiverManager;

        $scope.ready = false;
        $scope.$on(cast.CAST_MESSAGE, function (ev, castEvent) {
            if (castEvent.data.type === 'bye') {
                $scope.sessionCount--;
            } else if (castEvent.data.type === 'message') {
                $scope.addMessage(castEvent.data.message);
            }
        });
        $scope.$on(cast.SENDER_CONNECTED, function (ev, castEvent) {
            $log.info('Sender connected: ' + JSON.stringify(castEvent));
            if (idlePromise) {
                $scope.idle = false;
                $timeout.cancel(idlePromise);
                idlePromise = null;
            }
            $scope.connected++;
            $scope.sessionCount++;
        });
        $scope.$on(cast.SENDER_DISCONNECTED, function (ev, castEvent) {
            $scope.connected--;
            if ($scope.connected == 0) {
                if ($scope.getSessionCount() <= 0) {
                    cast.finish();
                } else {
                    $scope.idle = true;
                    if (idlePromise) {
                        $timeout.cancel(idlePromise);
                    }
                    idlePromise = $timeout(idleTimeout, 10000);
                }
            }
        });

        $scope.$on(cast.CAST_READY, function (e, manager) {
            receiverManager = manager;
        });

        $scope.getSessionCount = function () {
            return $scope.sessionCount;
        };

        $scope.getAvatar = function (url) {
            return url + "?sz=250";
        };

        $scope.addMessage = function (message) {
            if ($scope.messages.length >= 4) {
                $scope.messages.pop();
            }
            $scope.messages.unshift(message);
            cast.broadcast({"type": "message", "message": message});
        };

        $scope.test = function () {
            $scope.addMessage({"message": "hallo", "sender": "test", "avatar": "https://lh5.googleusercontent.com/-MwL2m3DRskE/AAAAAAAAAAI/AAAAAAAAFCk/f1ChcWHJqco/photo.jpg"})
        };
    });
