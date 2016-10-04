(function() {
  'use strict';

    /* @ngInject */
    function Topic(CachedDataService) {

      ///////////////////
      function getAll() {
        return CachedDataService.getValue('/api/topics');
      }

      function getTopicByCategoryAndSlug(category, slug) {
        return CachedDataService.getValue('/api/topics/' + category + '/' + slug);
      }

      function getMovieBySlug(slug) {
        return CachedDataService.getValue('/api/movies/s/' + slug);
      }

      function getUserTopicBySlug(username, slug) {
        return CachedDataService.getValue('api/topics/users/'+ username + '/' + slug);
      }

      function getAllUserTopics() {
        return CachedDataService.getValue('api/usertopics');
      }

      function postUserTopic(topicObj){

        var postObject = {
          user: topicObj.user,
          title: topicObj.title,
          category: 'users',
          mediaFiles: topicObj.mediaFiles
        }
        
        return CachedDataService.postValue('api/topics', postObject);
      }

      function postCustomTopic(topicObj){

        var props = _.merge({}, _.pick(topicObj, 'fields'));
        var postObject = {
          title: topicObj.title,
          description: topicObj.description,
          props: props,
          category: topicObj.category,
          mediaFiles: topicObj.mediaFiles
        }
        return CachedDataService.postValue('api/admin/topics', postObject);
      }
      ///////////////////////

      var service = {
        getAll : getAll,
        getTopicByCategoryAndSlug: getTopicByCategoryAndSlug,
        getMovieBySlug: getMovieBySlug,
        postUserTopic: postUserTopic,
        postCustomTopic: postCustomTopic,
        getUserTopicBySlug: getUserTopicBySlug,
        getAllUserTopics:  getAllUserTopics
      }

      return service;

  }

  angular
    .module('TwoCentzWeb')
    .factory('Topic', Topic);
})();
