(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('MovieCtrl', MoviesController);


  /* @ngInject */
  function MoviesController($scope, $user, $stateParams, Topic, Entries, User, HelperService) {
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
          $scope.words = HelperService.populateWordCloud($scope.topic.topEntries);
          $scope.userVoted = [];

          document.title = $scope.topic.title + " - TwoCentz";

          //check to see if user is logged in
          $user.get()
            .then(function(user){

              User.getUserEntriesByTopicId($scope.topic.id)
                .then(function (data){
                  if(data.error){
                    $scope.error = true;
                  } else {
                    $scope.userVoted = _.pluck(data.content, 'text');
                  }

                });
            })
            .catch(function(){
              //user not logged in
            })

        }
      });

    $scope.tc = {
      text: "",
      submited: false
    };

    // page properties.
    $scope.list = {
      text: "show all",
      text_all: "show all",
      text_less: "show less",
      limit: 5,
      default: 5,
      max: 100,
      isMax: false
    };

    $scope.keySubmit = function(keyEvent){
      if (keyEvent.which === 13){
         $scope.postTwoCentz();
      }
    };

    $scope.upVote = function(entryText){
      $scope.tc.text = entryText;
      $scope.postTwoCentz();
    };

    $scope.isVoted = function(entryText) {
      if(_.indexOf($scope.userVoted, entryText) > -1){
        return true;
      }else{
        return false;
      }
    };

    $scope.postTwoCentz = function(){
      //disabling submit until process is completed
      $scope.tc.submited = true;

      if($scope.tc.text !== null && $scope.tc.text.length>0){

        Entries.postEntriesByTopicId($scope.tc.text, $scope.topic.id)
          .then(function(data){
            if(data.created === 'true'){

              HelperService.addEntryToLocalCache($scope.tc.text, $scope.topic.topEntries, $scope.userVoted);
              $scope.topic.topEntries = HelperService.descSort($scope.topic.topEntries);
              $scope.words = HelperService.populateWordCloud($scope.topic.topEntries);
              $('.label-success').show().addClass('animated pulse').delay(2000).fadeOut(1000);

            }else{

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

  }
})();