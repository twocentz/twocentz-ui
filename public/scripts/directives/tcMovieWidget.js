/**
 * Created by Ilyas on 10/25/2015.
 */
(function () {
  'use strict';

  angular
      .module('TwoCentzWeb')
      .directive('tcMovieWidget', tcMovieWidget);

  function tcMovieWidget() {
    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        topic: '='
      },
      templateUrl: 'html/movieWidget.html'
    };
    return directive;

    function link(scope, element, attrs) {
      var topic = scope.topic;
      if(scope.topic._highlightResult){
        scope.title = topic._highlightResult.title.value;
        scope.image = topic.mediaFiles[0].url;
        scope.release = topic._highlightResult.props.releaseDate.value;
        scope.slug = topic.slug;
        scope.genre = topic._highlightResult.props.genre.value;
        scope.entries = getTopEntriesString(topic.topEntries, 50);
      } else {
        scope.title = topic.title;
        scope.image = topic.mediaFiles[0].url;
        scope.release = topic.props.releaseDate;
        scope.slug = topic.slug;
        scope.genre = topic.props.genre;
      }

      function getTopEntriesString(entries, maxLength){
        var result = "";
        _.each(entries, function(item){
          result += ' "' + item.text + '"';
          if(result.length >= maxLength){
             return false;
          }
        });
        return result;
      }
    }
  }

})();
