(function () {
  'use strict';



  function tcTopicDetails() {


    function link(scope, element, attrs) {

      scope.textField = [];
      scope.textArea = [];

      scope.$watch('category', function(newValue, oldValue) {
          if (newValue){
            if(scope.category === 'USERS'){
              if(scope.props.hasOwnProperty('textField')){
                scope.textField = scope.props.textField;
              }
              if(scope.props.hasOwnProperty('textArea')){
                scope.textArea = scope.props.textArea;
              }
            } else if(scope.category === 'MOVIES'){
              scope.releaseDate = moment(scope.props.releaseDate).format('MMM DD, YYYY');
              scope.genres = scope.props.genres.join(', ');
            }

          }
      });
    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        props: '=',
        media: '=',
        category: '@',
        title: '@',
        description: '@'
      },
      templateUrl: 'html/tcTopicDetails.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcTopicDetails', tcTopicDetails);

})();
