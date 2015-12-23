(function () {
  'use strict';

  angular
    .module('TwoCentzWeb')
    .directive('tcSocialShare', tcSocialShare);

  /* @ngInject */
  function tcSocialShare(encode, HelperService) {
    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        slug: '@',
        media: '=',
        entries: '=',
        title: '@',
        type: '@'
      },
      templateUrl: 'html/socialShare.html'
    };
    return directive;

    function link(scope, element, attrs) {
      // initializing social sharing buttons so they resize properly
      rrssbInit();

      scope.$watch('media', function(newValue, oldValue) {
          var baseUrl = 'https://twocentz-ui-stage.herokuapp.com/';
          if (newValue){
            scope.url =  baseUrl + scope.type +'/' + scope.slug;
            if(scope.type === 'user'){
              scope.img = 'https://res.cloudinary.com/twocentz/image/upload/a_auto/' + scope.media[0].public_id;
            } else {
              scope.img = scope.media[0].url;
            }
            var title = scope.title;
            scope.title = encode(scope.title);
            var entries = HelperService.getTopEntriesString(scope.entries, 50);
            scope.desc = encode(entries);

            //adding meta tags for prerendering
            $('head').append('<meta property="og:title" content="'+title+'" />');
            $('head').append('<meta property="og:url" content="'+scope.url+'" />');
            $('head').append('<meta property="og:image" content="'+scope.img+'" />');
            $('head').append("<meta property='og:description' content='"+entries+"' />");

          }
      });
    }
  }

})();
