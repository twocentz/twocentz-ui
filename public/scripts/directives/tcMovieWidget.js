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
        scope.entries = HelperService.getTopEntriesString(topic.topEntries, 5);
      } else {
        scope.title = topic.title;
        scope.image = topic.mediaFiles[0].url;
        scope.release = topic.props.releaseDate;
        scope.slug = topic.slug;
        scope.genre = topic.props.genre;
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
