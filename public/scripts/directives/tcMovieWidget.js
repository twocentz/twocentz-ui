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
      scope: {
        title: '=',
        slug: '=',
        image: '=',
        release: '=',
        genre: '='
      },
      templateUrl: 'html/movieWidget.html'
    };
    return directive;
  }

})();


