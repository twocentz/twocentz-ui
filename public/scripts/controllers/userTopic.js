/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';
  angular
      .module('TwoCentzWeb')
      .controller('UserTopicCtrl', UserTopicController);


  /* @ngInject */
  function UserTopicController($scope, $user, $stateParams, $q, $modal, Topic, Entries, toastr, User, HelperService) {
    $scope.error = false;
    $scope.colors = ["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"];

    
    // Show when some event occurs (use $promise property to ensure the template has been loaded)
    $scope.showModal = function() {
      var imgModal = $modal({scope: $scope, template: 'html/topicImage.html', show: false});
      imgModal.$promise.then(function(){
        imgModal.show();
      });
    };

    /**
     * Get movie detail.
     */
    Topic.getUserTopicBySlug($stateParams.username, $stateParams.slug)
        .then(function(data) {
          if(data.error){
            $scope.error = true;
            $scope.errorMessage = "Couldn't find information for topic '" + $stateParams.slug +"''";

          }else{
            if(data.content.length === 0){
              $scope.error = true;
              $scope.errorMessage = "Couldn't find information for topic '" + $stateParams.slug +"''";
            } else {
              $scope.topic = data.content[0];
              $scope.words = HelperService.populateWordCloud($scope.topic.topEntries);
              $scope.userVoted = [];

              document.title = $scope.topic.title + " - TwoCentz";

              //check to see if user is logged in
              $user.get()
                 .then(function(){

                   User.getUserEntriesByTopicId($scope.topic.id)
                       .then(function (data){
                         if(data.error){
                           toastr.error("Couldn't fetch user entries.", 'Warning');
                         } else {
                           $scope.userVoted = _.pluck(data.content, 'text');
                         }

                       });
                 })
                 .catch(function(){
                   //user not logged in
                 })
            }
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
      submitEntry(entryText);
    };

    $scope.isVoted = function(entryText) {
      if(_.indexOf($scope.userVoted, entryText) > -1){
        return true;
      }else{
        return false;
      }
    };

    $scope.postTwoCentz = function(){
      submitEntry($scope.tc.text)
          .then(function(data){
            if(data.created === 'true'){
              $('.label-success').show().addClass('animated pulse').delay(2000).fadeOut(1000);
            }else{
              $('.label-danger').show().addClass('animated shake').delay(2000).fadeOut(1000);
            }
            $scope.tc.text = "";
          })
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

    function submitEntry(entry){
      var deferred = $q.defer();

      if(!_.isEmpty(entry) && !$scope.tc.submited){
        //disabling submit until process is completed
        $scope.tc.submited = true;
        Entries.postUserTopicEntriesByTopicId(entry, $scope.topic.id)
            .then(function(data){
              if(data.created === 'true'){
                HelperService.addEntryToLocalCache(entry, $scope.topic.topEntries, $scope.userVoted);
                $scope.topic.topEntries = HelperService.descSort($scope.topic.topEntries);
                $scope.words = HelperService.populateWordCloud($scope.topic.topEntries);
              }

              deferred.resolve(data);
              // reseting submit widget value
              $scope.tc.submited = false;
            });
      }
      return deferred.promise;
    }

  }
})();
