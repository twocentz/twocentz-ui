/**
 * Created by Ilyas on 11/8/2015.
 */
(function() {
  'use strict';

  /* @ngInject */
  function VotesController($rootScope, $scope, $user, $state, $stateParams, $q, Topic, Entries, toastr, User, HelperService, SearchService) {
    var _this = this;
    var promise;
    
    $scope.error = false;
    $scope.users = [
                    {
                        'name'  : 'Restaurants & Cafe',
                        'value' : '57eafde9bdb0f2000382932b'
                    },
                    {
                        'name'  : 'New Movies',
                        'value' : '57eb03bebdb0f2000382932e'
                    },              
                    {
                        'name'  : 'Things To Do',
                        'value' : '57ed64d3112ece0003779d26'
                    },
                    {
                        'name'  : 'Tech News',
                        'value' : '581bf3ccbd381800034c6827'
                    },
                    {
                        'name'  : 'Entrepreneur',
                        'value' : '581bf6cebd381800034c6829'
                    },              
                    {
                        'name'  : 'Gadgets',
                        'value' : '581de21815843d0003918d9d'
                    }
                  ];

    $scope.multipleSelect = [];
    $scope.topics = [];


   

    $scope.tc = {
      text: '',
      submited: false
    };

    // page properties.
    $scope.list = {
      text: 'show all',
      text_all: 'show all',
      text_less: 'show less',
      limit: 5,
      default: 5,
      max: 100,
      isMax: false
    };

    function submitEntry(entry){
      var deferred = $q.defer();

      if(!_.isEmpty(entry) && !$scope.tc.submited){
        //disabling submit until process is completed
        $scope.tc.submited = true;
        Entries.postUserTopicEntriesByTopicId(entry, $scope.topic.id)
            .then(function(data){
              if(data.created === 'true'){
                HelperService.addEntryToLocalCache(entry, $scope.topic.top_entries, $scope.user_voted);
                $scope.topic.top_entries = HelperService.descSort($scope.topic.top_entries);
                $scope.words = HelperService.populateWordCloud($scope.topic.top_entries);
                $scope.topic.total_votes++;
              }

              deferred.resolve(data);
              // reseting submit widget value
              $scope.tc.submited = false;
            });
      }
      return deferred.promise;
    }

    

    $scope.keySubmit = function(keyEvent){
      if (keyEvent.which === 13){
        $scope.postTwoCentz();
      }
    };

    $scope.postTwoCentz = function(){
      submitEntry($scope.tc.text)
          .then(function(data){
            if(data.created === 'true'){
              $('.label-success').show().addClass('animated pulse block').delay(2000).fadeOut(1000);
            }else{
              $('.label-danger').show().addClass('animated shake block').delay(2000).fadeOut(1000);
            }
            $scope.tc.text = '';
          })
    };

    

    function search() {
      
      SearchService.search("")
        .then(function(hits){
          $scope.topics = hits;
        },function(err){
          //console.log(err);
        })
      
    }

    function activate(){
      search();
    }

    activate();

  }


  angular
    .module('TwoCentzWeb')
    .controller('VotesCtrl', VotesController);
})();
