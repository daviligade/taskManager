/*! taskmanager - v1.1.1 - 2016-04-21 */// Ionic taskmanager App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'taskmanager' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'taskmanager.controllers' is found in controllers.js
angular.module('taskmanager', ['ionic', 'taskmanager.controllers', 'taskmanager.services', 'taskmanager.directives'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('app.tasks', {
    url: '/tasks',
    views: {
      'menuContent': {
        templateUrl: 'templates/tasks.html',
        controller: 'TasksCtrl'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

angular.module('taskmanager.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

})

.controller('TasksCtrl', function($scope, Events, $http) {
  $scope.newEvent = {};
  $scope.showing = false;

  $http.get('https://s3-eu-west-1.amazonaws.com/appointedd-assets/tasks.json?callback=JSON_CALLBACK')
  .success(function (data) {
  $scope.httpObject = data.tasks;
  window.localStorage['events'] = JSON.stringify($scope.httpObject);
  console.log(data.tasks[1].description);
  });

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

angular.module('taskmanager.directives', [])
.directive('apTaskItem', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/task-list.html'
  };
});
angular.module('taskmanager.services', [])


.factory('Events', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data

  var events = [];

  return {
    all: function() {
      if(!window.localStorage['events']){
          window.localStorage['events'] = [];
          events = JSON.parse(window.localStorage['events']);
      } else {
          events = JSON.parse(window.localStorage['events']);
      }
      return events;
    },
    remove: function(event) {
      events.splice(events.indexOf(event), 1);
      window.localStorage['events'] = JSON.stringify(events);
    },
    get: function(eventId) {
      return events[eventId];
    },
    add: function(newest) {
      var newEvent = {
        //id: this.lastId()+1,
        description: newest.description,
        due_date: newest.due_date,
      };
      events.push(newEvent);
      window.localStorage['events'] = JSON.stringify(events);
    },
    lastId: function() {
      var lastId = 0;
      angular.forEach(events, function(event) {
        if (event.id > lastId) {
          lastId = event.id;
        }
      });
      return lastId;
    }
  };
});