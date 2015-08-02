angular.module('MyApp')
  .controller('MovieCtrl', function($scope, $stateParams, $timeout, Topic, Entries) {
    window.$scope = $scope;
    $scope.error = false;
    
    /**
     * Get movie detail.
     */
    // Topic.getMovieBySlug($stateParams.slug).then(function(data) {
    //   if(data.error){
    //     $scope.error = true;
    //   }else{
    //     $scope.topic = data;
    //     document.title = $scope.topic.title + " - TwoCentz";

    //     Entries.getMovieEntryById($scope.topic.id).then(function(data){
    //       if(!data.error){
    //         $scope.entries = data.content;
    //         $scope.words = [];
    //         _.each($scope.entries, function(entry){
    //           $scope.words.push({text: entry.text, weight: entry.votes});
    //         });
    //       }
    //     });
    //   }
    // });
    $scope.tc = {
      text: "",
      submited: false,
    }

    $scope.topic = {
          "id"  : "ABC123", 
          "title" : "The Running Man",
          "description": "A wrongly convicted man must try to survive a public execution gauntlet staged as a game show.",
          "tags": ["movie", "sci-fi", "action", "arnold"],
          "images": ["http://ia.media-imdb.com/images/M/MV5BNzM4OTcyMjEyNl5BMl5BanBnXkFtZTcwMzEwNDI4OA@@._V1_SX214_AL_.jpg"]
      };
    document.title =  $scope.topic.title + " - TwoCentz";

    $scope.entries = [
        {
            "text": "superb movie",
            "votes": 25
        },
        {
            "text": "great acting",
            "votes": 12
        },
        {
            "text": "nonsense storyline",
            "votes": 5
        },
        {
            "text": "lazy director",
            "votes": 1
        }
    ];
    $scope.words = [];
    
    _.each($scope.entries, function(entry){
      $scope.words.push({text: entry.text, weight: entry.votes});
    });

    $scope.postTwoCentz = function(){
      $scope.tc.submited = true;

      Entries.postEntriesByTopicId($scope.tc.text, $scope.topic.id).then(function(data){
        console.log(data);
        $scope.tc.text = "";
        $scope.tc.submited = false; 
      });

      $timeout(function(){
        $scope.tc.text = "";
        $scope.tc.submited = false; 
      }, 3000);

    }
  });