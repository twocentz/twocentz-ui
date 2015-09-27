angular.module('MyApp')
  .controller('MovieCtrl', function($scope, $stateParams, $timeout, Topic, Entries) {
    window.$scope = $scope;
    $scope.error = false;
    
    /**
     * Get movie detail.
     */
    Topic.getMovieBySlug($stateParams.slug)
    .then(function(data) {
      if(data.error){
        $scope.error = true;
      }else{
        $scope.topic = data;
        document.title = $scope.topic.title + " - TwoCentz";

        // Entries.getMovieEntryById($scope.topic.id)
        // .then(function(data){
        //   if(!data.error){
        //     $scope.entries = data.content;
        //     $scope.words = [];
        //     _.each($scope.entries, function(entry){
        //       $scope.words.push({text: entry.text, weight: entry.votes});
        //     });
        //   } else {
            
        //   }
        // });

        // make a call to user to get user entries for this topic


        // fake data
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
          }
        ];
    
        $scope.words = populateWordCloud($scope.entries);
        $scope.userVoted = [];
        // end fake data
      }
    });
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

    //$scope.userVoted = ["nonsense storyline", "just wow"];

    // $scope.topic = {
    //       "id"  : "ABC123", 
    //       "title" : "The Running Man",
    //       "description": "A wrongly convicted man must try to survive a public execution gauntlet staged as a game show.",
    //       "tags": ["movie", "sci-fi", "action", "arnold"],
    //       "images": ["http://ia.media-imdb.com/images/M/MV5BNzM4OTcyMjEyNl5BMl5BanBnXkFtZTcwMzEwNDI4OA@@._V1_SX214_AL_.jpg"]
    //   };
    // document.title =  $scope.topic.title + " - TwoCentz";

    

    $scope.keySubmit = function(keyEvent){
      if (keyEvent.which === 13){
         $scope.postTwoCentz();
      }   
    }

    $scope.upVote = function(entryText){
      $scope.tc.text = entryText;
      $scope.postTwoCentz();
    }

    $scope.isVoted = function(entryText) {
      if(_.indexOf($scope.userVoted, entryText) > -1){
        return true;
      }else{
        return false;
      }
    }

    $scope.postTwoCentz = function(){
      //disabling submit until process is completed
      $scope.tc.submited = true;

      if($scope.tc.text !== null && $scope.tc.text.length>0){
        Entries.postEntriesByTopicId($scope.tc.text, $scope.topic.id)
        .then(function(data){
          if(data.created === 'true'){
            
            addEntryLocally($scope.tc.text, $scope.entries, $scope.userVoted);
            $scope.entries = sortEntries($scope.entries);
            $scope.words = populateWordCloud($scope.entries);
            $('.label-success').show().addClass('animated pulse').delay(2000).fadeOut(1000);

          }else{

            //incase of error
            // console.log(data.status + " " + data.error);
            $('.label-danger').show().addClass('animated shake').delay(2000).fadeOut(1000);
          }
          // reseting submit widget value
          $scope.tc.text = "";
          $scope.tc.submited = false;
        });
      }
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

    // Helper functions which will be moved to a service class
    function populateWordCloud(entries){
      var wordCloud = [];
    
      _.each(entries, function(entry){
        wordCloud.push({text: entry.text, weight: entry.votes});
      });

      return wordCloud;
    }

    function sortEntries(entries){
      return _.sortBy(entries, function(entry) {
          return entry.votes * -1; // desc sorting
        });
    }

    function addEntryLocally(text, entries, userVoted){
      var index = _.findIndex(entries, function(entry) {
                        return entry.text == text;
                      });

      if(index !== -1){
        entries[index].votes = entries[index].votes + 1;
      } else {
        entries.push({"text":text, votes: 1});
      }
      userVoted.push(text);
    }


  });