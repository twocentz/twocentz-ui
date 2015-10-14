(function() {
  'use strict';
  angular
      .module('TwoCentzWeb')
      .factory('CachedDataService', CachedDataService);

  function CachedDataService() {
    var service = {
      descSort : descSort,
      populateWordCloud: populateWordCloud,
      addEntryToLocalCache: addEntryToLocalCache,
    }

    return service;

    ///////////////////
    function populateWordCloud(entries){
      var wordCloud = [];
      _.each(entries, function(entry){
        wordCloud.push({text: entry.text, weight: entry.votes});
      });

      return wordCloud;
    }

    function descSort(entries){
      return _.sortBy(entries, function(entry) {
        return entry.votes * -1; // desc sorting
      });
    }

    function addEntryToLocalCache(text, entries, userVoted){
      var index = _.findIndex(entries, function(entry) {
        return entry.text == text;
      });

      if(index !== -1){

        if(_.indexOf(userVoted, text) === -1){
          entries[index].votes = entries[index].votes + 1;
          userVoted.push(text);
        }

      } else {
        entries.push({"text":text, votes: 1});
      }

    }
  }

})();