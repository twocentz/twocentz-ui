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
      submited: false
    }

    // no of entries to show
    $scope.list = {
      text: "show all",
      text_all: "show all",
      text_less: "show less",
      limit: 5,
      default: 5,
      max: 100,
      isMax: false
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
            "votes": 9
        },
        {
            "text": "lazy director",
            "votes": 6
        },
        {
            "text": "just wow",
            "votes": 3
        },
        {
            "text": "stupid action",
            "votes": 2
        },
        {
            "text": "superb movie1",
            "votes": 25
        },
        {
            "text": "great acting2",
            "votes": 12
        },
        {
            "text": "nonsense storyline3",
            "votes": 9
        },
        {
            "text": "lazy director4",
            "votes": 6
        },
        {
            "text": "just wow5",
            "votes": 3
        },
        {
            "text": "stupid action6",
            "votes": 2
        }
    ];
    $scope.words = [];
    
    _.each($scope.entries, function(entry){
      $scope.words.push({text: entry.text, weight: entry.votes});
    });

    $scope.postTwoCentz = function(){
      

      Entries.postEntriesByTopicId($scope.tc.text, $scope.topic.id).then(function(data){
        if(data.status !== 200){
          console.log(data.status + " " + data.error);
          $scope.tc.submited = false;
          $('.label-danger').show().addClass('animated shake').delay(2000).fadeOut(1000);
        }else{
          $scope.tc.submited = true;
          $('.label-success').show().addClass('animated pulse').delay(2000).fadeOut(1000);
        }

        $scope.tc.text = "";
      });
    };

    $scope.toggleEntries = function(){

      if(!$scope.isMax){
        $scope.list.limit = $scope.list.max;
        $scope.list.text = $scope.list.text_less; 
        $scope.isMax = true;
      } else {
        $scope.list.limit = $scope.list.default;
        $scope.list.text = $scope.list.text_all; 
        $scope.isMax = false;
      }
      //angular.element(".list-group").addClass('animated pulse');
    };


  });