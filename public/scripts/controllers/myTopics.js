(function() {
  'use strict';


    /* @ngInject */
    function MyTopicsController($scope, Topic) {

      document.title =  'TwoCentz - My Topics';

      function displayTopics(){
       return Topic.getAllUserTopics().then(function(data) {
         $scope.topics = data.content;
         return $scope.topics;
       });
     }

     function activate(){
       //cleanup DOM
       $('.modal, .modal-backdrop').remove();

       return displayTopics().then(function(){
         //console.log("when rendering is finally called");
       });
     }

      activate();
    }

    angular
      .module('TwoCentzWeb')
      .controller('MyTopicsCtrl', MyTopicsController);
})();
