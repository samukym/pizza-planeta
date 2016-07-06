
(function() {
  'use strict';

  angular
    .module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService', 'UserService', '$window'];

  function LoginController($location, AuthenticationService, FlashService, UserService, $window) {
    var vm = this;

    vm.login = login;

    function loadTiendas() {
      UserService.GetTiendas()
        .then(function(tiendas) {
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
      var request = {
        id: vm.username,
        password: vm.password
      };
      AuthenticationService.Login(request, function (response){
                  if(response.success){
                    FlashService.Success(response.message, true);
                    $window.location.href ='/home/dash.html';
                  }
                  else {
                    FlashService.Error(response.message);
                  }
                  vm.dataLoading = false;
      });
    }


      // UserService.ValidLogin(request)
      //   .then(function(response) {
      //     if (response.success) {
      //       console.log('funciono (:');
      //       console.log(response.token);
      //       $rootScope.globals = {
      //           currentUser: {
      //               username: response.tienda._id,
      //               authdata: response.token
      //           }
      //       };
      //       $cookieStore.put('globals', $rootScope.globals);
      //       FlashService.Success('Registration successful', true);
      //       $location.path('/home');
      //     } else {
      //       FlashService.Error(response.message);
      //       vm.dataLoading = false;
      //     }
      //   });




      // AuthenticationService.Login(vm.username, vm.password, function (response) {
      //     if (response.success) {
      //         AuthenticationService.SetCredentials(vm.username, vm.password);
      //         $location.path('/');
      //     } else {
      //         FlashService.Error(response.message);
      //         vm.dataLoading = false;
      //     }
      // });

  }

})();
