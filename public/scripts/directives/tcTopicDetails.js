(function () {
  'use strict';



  function tcTopicDetails() {


    function link(scope, element, attrs) {

      scope.textField = [];
      scope.textArea = [];

      scope.$watch('category', function(newValue, oldValue) {
          if (newValue){
            if(scope.props.hasOwnProperty('fields')){
              scope.fields = scope.props.fields;
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
