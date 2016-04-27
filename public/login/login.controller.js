(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', 'UserService'];
    function LoginController($location, AuthenticationService, FlashService, UserService) {
        var vm = this;

        vm.login = login;

        function loadTiendas() {
            UserService.GetTiendas()
                .then(function (tiendas) {
                    vm.tiendas = tiendas;
                    console.log(tiendas);
                });
        }

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
            loadTiendas();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();
