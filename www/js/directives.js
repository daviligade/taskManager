angular.module('taskmanager.directives', [])
.directive('apTaskItem', function() {
  return {
    restrict: 'E',
    templateUrl: '/templates/task-list.html'
  };
});