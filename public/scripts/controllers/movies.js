angular.module('MyApp')
  .controller('MovieCtrl', function($scope, $stateParams, Topic, Entries) {
    $scope.error = false;
    
    /**
     * Get movie detail.
     */
    Topic.getMovieBySlug($stateParams.slug).then(function(data) {
      if(data.error){
        $scope.error = true;
      }else{
        $scope.topic = data;
        document.title = $scope.topic.title + " - TwoCentz";

        Entries.getMovieEntryById($scope.topic.id).then(function(data){
          if(!data.error){
            $scope.entries = data.content;
            $scope.words = [];
            _.each($scope.entries, function(entry){
              $scope.words.push({text: entry.text, weight: entry.votes});
            });
          }
        });
      }
    });
  });