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
      scope.entries = HelperService.getTopEntriesString(topic.topEntries, 5);

    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        topic: '='
      },
      templateUrl: 'html/topicWidget.html'
    };
    return directive;

  }

  angular
    .module('TwoCentzWeb')
    .directive('tcTopicWidget', tcTopicWidget);

})();
