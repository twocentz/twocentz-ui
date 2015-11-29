(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .factory('Topic', Topic);
    /* @ngInject */
    function Topic(CachedDataService) {
      var service = {
        getAll : getAll,
        getTopicBySlug: getTopicBySlug,
        getMovieBySlug: getMovieBySlug,
        postUserTopic: postUserTopic,
        getUserTopicBySlug: getUserTopicBySlug,
        getAllUserTopics:  getAllUserTopics
      }

      return service;

      ///////////////////
      function getAll() {
        return CachedDataService.getValue('/api/topics');
      };

      function getTopicBySlug(slug) {
        return CachedDataService.getValue('/api/topics/s/' + slug);
      };

      function getMovieBySlug(slug) {
        return CachedDataService.getValue('/api/movies/s/' + slug);
      };

      function getUserTopicBySlug(username, slug) {
        return CachedDataService.getValue('api/topics/users/'+ username + '/' + slug);
      };

      function getAllUserTopics() {
        return CachedDataService.getValue('api/usertopics');
      };

      function postUserTopic(topicObj){

        var props = _.merge({}, _.pick(topicObj, 'textArea'),_.pick(topicObj, 'textField'));
        var postObject = {
          title: topicObj.title,
          description: topicObj.description,
          props: props,
          mediaFiles: topicObj.mediaFiles
        }

        return CachedDataService.postValue('api/topics/users', postObject);
      }
  }

})();
