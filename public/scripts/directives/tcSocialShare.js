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
        type: '@',
        user: '@'
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
              scope.img = scope.media[0].secure_url;
              scope.url =  baseUrl + scope.type +'/' + scope.user + '/' + scope.slug;
            } else {
              scope.img = scope.media[0].url;
              scope.url =  baseUrl + scope.type +'/' + scope.slug;
            }
            var title = scope.title;
            scope.title = encode(scope.title);
            var entries = HelperService.getTopEntriesString(scope.entries, 50);
            scope.desc = encode(entries);

            //cleaning up existing meta tags
            $('head').find('.tc_meta_tags').remove();

            //adding facebook meta tags for prerendering
            $('head').append('<meta class="tc_meta_tags" property="fb:app_id" content="302184056577324" />'); //using twocentz facebook app id
            $('head').append('<meta class="tc_meta_tags" property="og:type" content="website" />');
            $('head').append('<meta class="tc_meta_tags" property="og:site_name" content="Twocentz" />');
            $('head').append('<meta class="tc_meta_tags" property="og:title" content="'+title+'" />');
            $('head').append('<meta class="tc_meta_tags" property="og:url" content="'+scope.url+'" />');
            $('head').append('<meta class="tc_meta_tags" property="og:image" content="'+scope.img+'" />');
            $('head').append('<meta class="tc_meta_tags" property="og:description" content="'+entries+'" />');

            //adding twitter meta tags
            $('head').append('<meta class="tc_meta_tags" name="twitter:card" content="summary" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:site" content="@twocentz" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:title" content="'+title+'" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:image" content="'+scope.img+'" />');
            $('head').append('<meta class="tc_meta_tags" property="twitter:description" content="'+entries+'" />');
          }
      });
    }
  }

})();
