(function () {
  'use strict';



  function tcTopicWidget(HelperService, $state) {
    
    function getTopEntriesLimit(entries, maxLength){
      var results = [];
      var result = '';
      _.each(entries, function(item){
        result += ' "' + item.text + '"';
        results.push(item.text);
        if(result.length >= maxLength){
           return false;
        }
      });
      return results;
    }

    function link(scope, element, attrs) {
      var topic = scope.topic;

      if(topic._highlightResult){
        scope.title = topic._highlightResult.title.value;
      } else {
        scope.title = topic.title;
      }
      if(topic.media_files.length){
        scope.image_id = topic.media_files[0].public_id;
      }
    

      scope.slug = topic.slug;
      scope.category = topic.category;
      scope.userName = topic.username;
      scope.userId = topic.user_id;
      scope.twocentz = HelperService.getTopPercentage(topic.total_votes, topic.top_entries);
      scope.entries = getTopEntriesLimit(topic.top_entries, 30);

      scope.gotoTopic = function(slug){
        if(topic.category === 'USERS'){
          $state.transitionTo('usertopic', { username: topic.username, slug: topic.slug });
        } else {
          $state.transitionTo(topic.category.toLowerCase(), { slug: topic.slug });
        } 
      }
    }

    

    var directive = {
      restrict: 'EA',
      link: link,
      scope: {
        topic: '='
      },
      templateUrl: 'html/tcTopicWidget.html'
    };
    return directive;

  }

  angular
    .module('TwoCentzWeb')
    .directive('tcTopicWidget', tcTopicWidget);

})();
