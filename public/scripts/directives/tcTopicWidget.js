(function () {
  'use strict';



  function tcTopicWidget(HelperService, $state) {

    function link(scope, element, attrs) {
      var topic = scope.topic;

      if(topic._highlightResult){
        scope.title = topic._highlightResult.title.value;
      } else {
        scope.title = topic.title;
      }
      if(topic.mediaFiles.length){
        scope.image_id = topic.mediaFiles[0].public_id;
      }
    

      scope.slug = topic.slug;
      scope.category = topic.category;
      scope.userName = topic.userName;
      scope.userId = topic.userId;
      scope.twocentz = HelperService.getTopPercentage(topic.totalVotes, topic.topEntries);

      scope.gotoTopic = function(slug){
        if(topic.category === 'USERS'){
          $state.transitionTo('usertopic', { username: topic.userName, slug: topic.slug });
        } else {
          $state.transitionTo(topic.category.toLowerCase(), { slug: topic.slug });
        } 
      }
    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        topic: '='
      },
      templateUrl: 'html/tcTopicWidget.html'
    };
    return directive;

  }

  angular
    .module('TwoCentzWeb')
    .directive('tcTopicWidget', tcTopicWidget);

})();
