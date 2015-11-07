(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('HomeCtrl', HomeController);

    /* @ngInject */
    function HomeController($scope, algolia, Topic) {
      
      document.title =  "TwoCentz - topics, reviews, opinions";

      $scope.categories = ['ALL', 'MOVIES', 'PRODUCTS', 'OTHERS'];


      //$scope.query = '';
      //$scope.hits = [];
      var client = algolia.Client('05FTLLM54V', '657c40e74e8a05261076878c1d08d093');
      var index = client.initIndex('twocentz_movies');


      $scope.search = search;

      function search (foo) {
        return index.search(foo)
            .then(function searchSuccess(content) {
              console.log(content);
              return $scope.topics = content.hits;
            }, function searchFailure(err) {
              console.log(err);
            });
      };


      function displayTopics(){
        return Topic.getAll().then(function(data) {
          $scope.topics = data.content;
          return $scope.topics;
        });
      };

      function activate(){
        return search("October 2015").then(function(){
          //console.log("when rendering is finally called");
        });
      };

      activate();
      
      
    }
})();