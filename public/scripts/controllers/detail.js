angular.module('MyApp')
  .controller('DetailCtrl', function($scope, $rootScope, $stateParams, Topic) {
      Topic.get({ slug: $stateParams.slug }, function(topic) {
        $scope.topic = topic;
      });
    });