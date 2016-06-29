(function () {
  'use strict';

  /* @ngInject */
  function tcSocialShare(HelperService) {


    function link(scope, element, attrs) {
      // initializing social sharing buttons so they resize properly
      rrssbInit();

      scope.$watch('media', function(newValue, oldValue) {

          var baseUrl = 'https://twocentz.co/';
          var entries, title;
          if (newValue){
            if(scope.media[0]){
                scope.img = scope.media[0].secure_url;
              }
            if(scope.type === 'USERS'){
              scope.url =  baseUrl + 'user' +'/' + scope.user + '/' + scope.slug;
            } else {
              scope.url =  baseUrl + scope.type.toLowerCase() +'/' + scope.slug;
            }
            title = scope.title;
            scope.title = HelperService.encode(scope.title);
            if(scope.topic.totalVotes > 0){
              entries = HelperService.getTopPercentage(scope.topic.totalVotes, scope.entries)[0] + ' ' + scope.topic.topEntries[0].text;
            } else {
              entries = '';
            }
            
            //var entries = HelperService.getSocialShareDescription(scope.entries);
            scope.desc = HelperService.encode(entries);

            //cleaning up existing meta tags
            $('head').find('.tc_meta_tags').remove();

            //adding facebook meta tags for prerendering
            $('head').append('<meta class="tc_meta_tags" property="fb:app_id" content="302184056577324" />'); //using twocentz facebook app id
            $('head').append('<meta class="tc_meta_tags" property="og:type" content="website" />');
            $('head').append('<meta class="tc_meta_tags" property="og:site_name" content="Twocentz" />');
            $('head').append('<meta class="tc_meta_tags" property="og:title" content="'+title+'" />');
            $('head').append('<meta class="tc_meta_tags" property="og:url" content="'+scope.url+'" />');
            $('head').append('<meta class="tc_meta_tags" property="og:image" content="'+scope.img+'" />');
            // $('head').append('<meta class="tc_meta_tags" property="og:description" content="'+entries+'" />');

            //adding twitter meta tags
            $('head').append('<meta class="tc_meta_tags" name="twitter:card" content="summary" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:site" content="@twocentz" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:title" content="'+title+'" />');
            $('head').append('<meta class="tc_meta_tags" name="twitter:image" content="'+scope.img+'" />');
            // $('head').append('<meta class="tc_meta_tags" property="twitter:description" content="'+entries+'" />');
          }
      });
    }

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        slug: '@',
        media: '=',
        entries: '=',
        title: '@',
        type: '@',
        user: '@',
        topic: '='
      },
      templateUrl: 'html/tcSocialShare.html'
    };
    return directive;
  }

  angular
    .module('TwoCentzWeb')
    .directive('tcSocialShare', tcSocialShare);


})();
