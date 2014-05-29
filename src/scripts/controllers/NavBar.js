angular.module('futurism')
    .controller('navBarCtrl', function($scope, me, $, messager, session, $location, unread, socket, modals, websites, sound) {
        'use strict';

        $scope.path = '';
        $scope.me = me;
        $scope.messager = messager;
        $scope.unread = unread;
        $scope.sound = sound;


        $scope.$on('$routeChangeSuccess', function(event, current) {
            if(current.$$route) {
                $scope.path = current.$$route.originalPath;
            }
            else {
                $scope.path = '/';
            }
        });


        $scope.atDeckBuilder = function() {
            return $scope.path.indexOf('/deck-builder') !== -1 || $scope.path.indexOf('/deck-selector') !== -1;
        };


        $scope.atCardBuilder = function() {
            return $scope.path.indexOf('/card-builder') !== -1 || $scope.path.indexOf('/card-selector') !== -1;
        };


        $scope.atLobby = function() {
            return $scope.path === '/lobby';
        };


        $scope.atStore = function() {
            return $scope.path === '/t-machine';
        };


        $scope.atGuild = function() {
            return $scope.path === '/guild' || $scope.path === '/guild-joiner' || $scope.path === '/guild-list';
        };
        
        
        $scope.clickStats = function() {
            modals.openUser(me.user._id);
        };
        
        
        $scope.clickInvites = function() {
            modals.openInvites();
        };
        
        
        $scope.clickApplicants = function() {
            modals.openApplicants();
        };


        $scope.shouldShow = function() {
            return $scope.path !== '/title' && $scope.path.indexOf('/game') !== 0 && $scope.path !== '/';
        };


        $scope.logout = function() {
            socket.disconnect();
            session.destroy();
            websites.logout();
            $location.url('/');
        };


        /**
         * Close the responsive navbar when a link is clicked
         */
        $(document).on('click','.navbar-collapse.in',function(e) {
            if( $(e.target).is('a') ) {
                $(this).collapse('hide');
            }
        });
    });