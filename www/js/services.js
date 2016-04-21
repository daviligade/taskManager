angular.module('taskmanager.services', [])

.factory('getHttpObjectService', function($http) {
  var httpObject = [];

  return {
    getHttpObject: function(){
      return $http.get('https://s3-eu-west-1.amazonaws.com/appointedd-assets/tasks.json')
        .then(function (data) {
        httpObject = data.tasks;
        //window.localStorage['events'] = JSON.stringify($scope.httpObject);
        return httpObject;
      });
    }
  }
})

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