(function () {
  'use strict';



  function tcTopicWidget(HelperService) {

    function link(scope, element, attrs) {
      var topic = scope.topic;
      scope.title = topic.title;
      if(topic.mediaFiles && topic.mediaFiles.length >0){
        scope.image = topic.mediaFiles[0].public_id;
      } else {
        scope.image = null;
      }

      scope.slug = topic.slug;
      scope.userName = topic.userName;
      scope.twocentz = HelperService.getTopicTwoCentz(topic.totalVotes, topic.topEntries);

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
