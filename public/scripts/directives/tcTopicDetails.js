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
      templateUrl: 'html/topicDetails.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcTopicDetails', tcTopicDetails);

})();
