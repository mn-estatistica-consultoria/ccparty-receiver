'use strict';

angular.module('ccparty.services', [])
    .service('cast',function Cast($window, $rootScope, $q) {
        var NAMESPACE = "urn:x-cast:org.dutchaug.ccparty";
        this.CAST_MESSAGE = "cast-message";
        this.CAST_READY = "cast-ready";
        this.SENDER_CONNECTED = "sender-connected";
        this.SENDER_DISCONNECTED = "sender-disconnected";
        var receiverManager;
        var messageBus;
        var service = this;
        var initPromise = $q.defer();

        var initializeCast = function initializeCast() {
            receiverManager = $window.cast.receiver.CastReceiverManager.getInstance();
            receiverManager.onSenderConnected = function (event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.SENDER_CONNECTED, event);
                });
            };
            receiverManager.onSenderDisconnected = function (event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.SENDER_DISCONNECTED, event);
                });
            };
            messageBus = receiverManager.getCastMessageBus(NAMESPACE, cast.receiver.CastMessageBus.MessageType.JSON);
            messageBus.onMessage = function (event) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(service.CAST_MESSAGE, event);
                })
            };
            receiverManager.start();
            initPromise.resolve(receiverManager);
            $rootScope.$broadcast(service.CAST_READY, receiverManager);
        };

        this.boot = function () {
            $window.onload = function () {
                $rootScope.$apply(function () {
                    initializeCast();
                });
            };
        };

        this.initialized = function () {
            return initPromise;
        }

        this.finish = function () {
            receiverManager.stop();
            initPromise = $q.defer();
        };

        this.broadcast = function (message) {
            messageBus.broadcast(message);
        }
    }).
    run(function (cast) {
        cast.boot();
    });
