angular.module('taskmanager.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('TasksCtrl', function($scope, Events, getHttpObjectService, $http) {
  $scope.newEvent = {};
  $scope.showing = false;

  getHttpObjectService.getHttpObject().then(function(object){
    $scope.httpObject = object.tasks;
  });
  /*$http.get('https://s3-eu-west-1.amazonaws.com/appointedd-assets/tasks.json?callback=JSON_CALLBACK')
  .success(function (data) {
  $scope.httpObject = data.tasks;
  window.localStorage['events'] = JSON.stringify($scope.httpObject);
  console.log(data.tasks[1].description);
  });*/

  $scope.tasks = Events.all();
  $scope.remove = function(event) {
    Events.remove(event);
  };
  $scope.add = function() {
    Events.add($scope.newEvent);
    $scope.showing = false;
    $scope.newEvent = {};
  };
  $scope.showAdd = function () {
    $scope.showing = true;
  }

  $scope.isDue = function (date) {
    var now = new Date();
    var due = new Date(date.due_date);

    var yearDue = due.getFullYear();
    var monthDue = due.getMonth(); //+1
    var dayDue = due.getDate();

    var dateDue = new Date(yearDue,monthDue,dayDue)

    if (dateDue.getTime() < now.getTime()) {
      return 'The task is already done';
    } else {
      // Set the unit values in milliseconds.
      var msecPerMinute = 1000 * 60;
      var msecPerHour = msecPerMinute * 60;
      var msecPerDay = msecPerHour * 24;
      var msecPerYear = msecPerDay * 365;

      // I take the "due date" in milliseconds.
      var dateMsec = dateDue.getTime();

      // Get the difference in milliseconds (between due date and now's date).
      var interval = dateMsec - now.getTime();

      // Calculate how many days the interval contains. Subtract that
      // many days from the interval to determine the remainder.
      var days = Math.floor(interval / msecPerDay );
      interval = interval - (days * msecPerDay );

      // Display the result.
      var phrase = "Due in ";
      phrase += (days+1) + " day";       
        if (days != 1)
          phrase += "s" ;
      phrase += "."
      return phrase;
    }
  }
})
