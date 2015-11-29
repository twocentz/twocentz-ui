(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .controller('MyTopicsCtrl', MyTopicsController);

    /* @ngInject */
    function MyTopicsController($scope, Topic) {

      document.title =  "TwoCentz - My Topics";

      function displayTopics(){
       return Topic.getAllUserTopics().then(function(data) {
         $scope.topics = data.content;
         return $scope.topics;
       });
     };

     function activate(){
       return displayTopics().then(function(){
         //console.log("when rendering is finally called");
       });
     };

      activate();
    }
})();
