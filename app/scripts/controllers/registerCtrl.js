'use strict';

angular.module('scheduler')
  .controller('RegisterCtrl', function($route, $auth, $scope, Config, $http, $location) {
    var baseUrl = Config.apiBase + '/register';

    $scope.register = __register() {
      $auth.signup({
        emp_num: $scope.user.emp_num,
        password: $scope.user.password
      }).then(function (response) {
        console.log(response);
        $location.path('/');
      }).catch(function (response) {
        console.log(response);
        window.alert('Error: Registration failed');
      });
  }

})



// .controller(‘RegisterCtrl’, function ($state, $auth) {
//   var vm = this;
//   vm.user = {};
//   vm.register = function __register() {
//     $auth.signup({
//       name: vm.user.name,
//       email: vm.user.email,
//       password: vm.user.password
//     }).then(function (response) {
//       console.log(response);
//       $state.go(‘dashboard’);
//     }).catch(function (response) {
//       console.log(response);
//       window.alert(‘Error: Register failed’);
//     });
//   };
// })
