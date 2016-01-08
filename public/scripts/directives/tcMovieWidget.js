/**
 * Created by Ilyas on 10/25/2015.
 */
(function () {
  'use strict';

  function tcMovieWidget(HelperService) {
    function link(scope, element, attrs) {
      var topic = scope.topic;
      if(scope.topic._highlightResult){
        scope.title = topic._highlightResult.title.value;
        scope.image = topic.mediaFiles[0].url;
        scope.release = topic._highlightResult.props.releaseDate.value;
        scope.slug = topic.slug;
        scope.genre = topic._highlightResult.props.genre.value;
        scope.twocentz = HelperService.getTopicTwoCentz(topic.totalVotes, topic.topEntries);
      } else {
        scope.title = topic.title;
        scope.image = topic.mediaFiles[0].url;
        scope.release = topic.props.releaseDate;
        scope.slug = topic.slug;
        scope.genre = topic.props.genre;
        scope.twocentz = HelperService.getTopicTwoCentz(topic.totalVotes, topic.topEntries);
      }
    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        topic: '='
      },
      templateUrl: 'html/movieWidget.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcMovieWidget', tcMovieWidget);


})();
