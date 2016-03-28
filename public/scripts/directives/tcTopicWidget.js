(function () {
  'use strict';



  function tcTopicWidget(HelperService) {

    function link(scope, element, attrs) {
      var topic = scope.topic;
      if(topic._highlightResult){
        scope.title = topic._highlightResult.title.value;
      }
      scope.title = topic.title;
      scope.slug = topic.slug;
      scope.category = topic.category;
      scope.twocentz = HelperService.getTopPercentage(topic.totalVotes, topic.topEntries);

      if(topic.category !== null){
        if(topic.mediaFiles.length){
          scope.image_id = topic.mediaFiles[0].public_id;
        }
        scope.userName = topic.userName;
        scope.userId = topic.userId;
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
