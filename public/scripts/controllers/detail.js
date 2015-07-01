angular.module('MyApp')
  .controller('DetailCtrl', function($scope, $stateParams, Topic) {
      /**
       * Retrieve all topics from topic factory.
       */
      Topic.getTopicBySlug($stateParams.slug).then(function(data) {
        $scope.topic = data;
      });
    });