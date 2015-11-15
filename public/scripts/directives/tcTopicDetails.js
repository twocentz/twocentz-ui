(function () {
  'use strict';

  angular
      .module('TwoCentzWeb')
      .directive('tcTopicDetails', tcTopicDetails);

  function tcTopicDetails() {
    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        props: '=',
        category: '='
      },
      templateUrl: 'html/topicDetails.html'
    };
    return directive;

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
                scope.textArea =scope.props.textArea;
              }
            }
          }
      });
    }
  }

})();
