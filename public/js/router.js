
app .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/eventDetails/:eventId', {
        templateUrl: 'templates/eventDetails.html',
        controller: 'EventDeatilsController'
      }).
      when('/registerAttendee/:eventId', {
        templateUrl: 'templates/registration.html',
        controller: 'RegisterController'
      }).
      when('/eventList', {
        templateUrl: 'templates/eventList.html',
        controller: 'EventListController'
      }).
      otherwise({
        redirectTo: '/eventList'
      });
  }]);