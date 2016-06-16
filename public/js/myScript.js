
var app = angular.module("eventApp", ['ngRoute']);
app.controller('MainController', function() {});

//directives
app.directive('globalHeader',function(){
return{
  restrict:"E",
  templateUrl:"/templates/header.html"
};
});

app.directive('globalFooter',function(){
return{
  restrict:"E",
  templateUrl:"/templates/footer.html"
};
});

//Service 
app.service('shareDataService', function() {
    var myEventList = [];
    var mySessionList = [];

    var addEvent = function(newObj) {
        myEventList.push(newObj);
    }
    var addSession = function(newObj) {
        mySessionList.push(newObj);
    }
    var getEventList = function() {
        return myEventList;
    }
    var getSessionList = function() {
        return mySessionList;
    }
    var getEvent = function(eventId) {
        for (i = 0; i < myEventList[0].length; i++) {
            if (parseInt(eventId) == myEventList[0][i].id) {
                return myEventList[0][i];
            }
        }
    }
    var resetEventList = function() {
        myEventList.length = 0;
    }
    var resetSessionList = function() {
        mySessionList.length = 0;
    }
    return {
        addEvent: addEvent,
        getEventList: getEventList,
        getEvent: getEvent,
        addSession: addSession,
        getSessionList: getSessionList,
        resetEventList: resetEventList,
        resetSessionList: resetSessionList
    };

});


//Event list controller
app.controller('EventListController', function($scope, $http, shareDataService) {
    $scope.loadingIndicator = true;
    shareDataService.resetEventList();
    $http({
        method: 'GET',
        url: '/selectEvent'
    }).then(function successCallback(response) {
        console.log("response is---" + JSON.stringify(response.data.rows));
        $scope.events = response.data.rows;
        shareDataService.addEvent($scope.events);
        $scope.loadingIndicator = false;
    }, function errorCallback(response) {
        console.log("error is---" + JSON.stringify(response));
    });

});

//Event detail Controller
app.controller('EventDeatilsController', function($scope, $http, shareDataService, $routeParams) {
    $scope.loadingIndicator = true;
    shareDataService.resetSessionList();
    $scope.event_id = $routeParams.eventId;
    $scope.event = shareDataService.getEvent($scope.event_id);

    $http({
        method: 'POST',
        url: '/selectSessions',
        data: JSON.stringify({
            event_id: $scope.event_id
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"

    }).then(function successCallback(response) {
        console.log("response is---" + JSON.stringify(response.data.rows));
        $scope.sessions = response.data.rows;
        shareDataService.addSession($scope.sessions);
        $scope.loadingIndicator = false;
    }, function errorCallback(response) {
        console.log("error is---" + JSON.stringify(response));
    });
});

// Register Attendee Controller
app.controller('RegisterController', function($scope, $http, shareDataService, $routeParams) {
    $scope.formSuccessAlert = false;
    $scope.formErrorAlert = false;
    $scope.sessionErrorAlert = false;
    $scope.formAlreadyRegister=false;
    $scope.event_id = $routeParams.eventId;
    $scope.sessionName = shareDataService.getSessionList();
    $scope.eventData = shareDataService.getEvent($scope.event_id);
    $scope.eventAddress = $scope.eventData.sfid;
    var selectedSession;

    $scope.registerAttendee = function(registerForm) {

        if (!registerForm.$valid) {

            $scope.formErrorAlert = true;

        } else {

            $scope.formErrorAlert = false;
            if (($scope.sessionName[0].length != 0) && (!registerForm.attendeeSession.$viewValue)) {
                $scope.sessionErrorAlert = true;
            } else {
               $scope.loadingIndicator = true;
                if ($scope.sessionName[0].length == 0) {
                    selectedSession = "";
                } else {
                    selectedSession = $scope.form.selectedSession;
                }
                $scope.sessionErrorAlert = false;

                $http({
                    method: 'POST',
                    url: '/registerAttendee',
                    data: JSON.stringify({
                        first_name: $scope.form.attendee_firstName,
                        last_name: $scope.form.attendee_lastName,
                        emai_id: $scope.form.attendee_email,
                        phone: $scope.form.attendee_phone,
                        company: $scope.form.attendee_company,
                        session: selectedSession,
                        event: $scope.eventAddress
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"

                }).then(function successCallback(response) {
                   $scope.loadingIndicator = false;
                    console.log("response is---" + JSON.stringify(response.data));
                    if(response.data.message){
                      $scope.formAlreadyRegister=true;
                      $scope.formSuccessAlert = false;
              
                    }
                    else{
                    $scope.formAlreadyRegister = false;
                    $scope.formSuccessAlert=true;
                   
                  }

                }, function errorCallback(response) {
                   $scope.loadingIndicator = false;
                    console.log("error is---" + JSON.stringify(response));
                });
            }
        }
    }
});